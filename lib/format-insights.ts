export function formatInsights(rawText: string): string {
    // Remove markdown formatting mas mantém estrutura
    const cleanText = rawText
      // Remove bold markdown (**text**) mas mantém o texto
      .replace(/\*\*(.*?)\*\*/g, "$1")
      // Remove italic markdown (*text*)
      .replace(/\*(.*?)\*/g, "$1")
      // Remove headers (# ## ###) mas mantém o texto
      .replace(/^#{1,6}\s+/gm, "")
      // Converte bullet points markdown para bullets visuais
      .replace(/^[-*+]\s+/gm, "• ")
      // Converte numbered lists
      .replace(/^\d+\.\s+/gm, (match, offset, string) => {
        const lineStart = string.lastIndexOf("\n", offset) + 1
        const lineNumber = string.substring(lineStart, offset).match(/^\d+/) || ["1"]
        return `${lineNumber[0]}. `
      })
      // Remove code blocks (```)
      .replace(/```[\s\S]*?```/g, "")
      // Remove inline code (`text`)
      .replace(/`([^`]+)`/g, "$1")
      // Remove links [text](url)
      .replace(/\[([^\]]+)\]$$[^)]+$$/g, "$1")
      // Clean up excessive spaces but keep line structure
      .replace(/[ \t]+/g, " ")
      // Trim each line but keep line breaks
      .split("\n")
      .map((line) => line.trim())
      .join("\n")
      // Clean up excessive line breaks (mais de 2 seguidas)
      .replace(/\n{3,}/g, "\n\n")
      .trim()
  
    return cleanText
  }
  
  export function formatInsightsForDisplay(rawText: string): string {
    const cleanText = formatInsights(rawText)
  
    // Processa o texto para melhor exibição
    const lines = cleanText.split("\n")
    const formattedLines = lines.map((line, index) => {
      const trimmed = line.trim()
  
      // Linha vazia - mantém para espaçamento
      if (!trimmed) return ""
  
      // Seções com emojis - adiciona espaçamento extra
      if (trimmed.match(/^[🎯📊🔧📈✅❌⚠️💡🚀]/u)) {
        return `\n${trimmed}`
      }
  
      // Listas com bullets
      if (trimmed.startsWith("•") || trimmed.match(/^\d+\./)) {
        return trimmed
      }
  
      // Texto normal
      return trimmed
    })
  
    return formattedLines.join("\n").replace(/\n{3,}/g, "\n\n")
  }
  
  export function formatInsightsForPDF(rawText: string): string {
    const cleanText = formatInsights(rawText)
  
    // Format specifically for PDF generation (HTML-safe)
    return (
      cleanText
        // Escape HTML characters
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
        // Processa linha por linha para manter estrutura
        .split("\n")
        .map((line) => {
          const trimmed = line.trim()
  
          // Linha vazia vira espaçamento
          if (!trimmed) return "<br>"
  
          // Seções com emojis viram headers
          if (trimmed.match(/^[🎯📊🔧📈✅❌⚠️💡🚀]/u)) {
            return `<h3 style="margin-top: 20px; margin-bottom: 10px; color: #374151;">${trimmed}</h3>`
          }
  
          // Listas viram list items
          if (trimmed.startsWith("•")) {
            return `<li style="margin-bottom: 5px;">${trimmed.substring(1).trim()}</li>`
          }
  
          if (trimmed.match(/^\d+\./)) {
            return `<li style="margin-bottom: 5px;">${trimmed}</li>`
          }
  
          // Parágrafos normais
          return `<p style="margin-bottom: 10px; line-height: 1.6;">${trimmed}</p>`
        })
        .join("")
        // Agrupa list items em listas
        .replace(/(<li[^>]*>.*?<\/li>)+/g, (match) => {
          if (match.includes("1.") || match.includes("2.")) {
            return `<ol style="margin: 10px 0; padding-left: 20px;">${match}</ol>`
          }
          return `<ul style="margin: 10px 0; padding-left: 20px;">${match}</ul>`
        })
    )
  }
  