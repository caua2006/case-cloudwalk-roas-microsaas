interface PDFData {
    roas: number
    valorInvestido: number
    receitaGerada: number
    insights: string
    plataforma?: string
    dataCampanha?: string
    nomeUsuario: string
    emailUsuario: string
  }
  
  export function generateROASPDF(data: PDFData): string {
    console.log("📄 Gerando relatório HTML...")
  
    // Escapar caracteres especiais
    const escapeHtml = (text: string) => {
      if (!text) return ""
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
    }
  
    const htmlContent = `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório ROAS</title>
    <style>
        @charset "UTF-8";
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
            background: #fff;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #7c3aed; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #7c3aed; 
            margin-bottom: 10px;
        }
        .title { 
            font-size: 28px; 
            font-weight: bold; 
            margin: 20px 0;
            color: #1f2937;
        }
        .subtitle { 
            color: #666; 
            font-size: 14px;
        }
        .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin: 30px 0;
        }
        .info-item { 
            background: #f8fafc; 
            padding: 15px; 
            border-radius: 8px; 
            border-left: 4px solid #7c3aed;
        }
        .info-label { 
            font-weight: bold; 
            color: #374151; 
            font-size: 12px; 
            text-transform: uppercase;
            margin-bottom: 5px;
        }
        .info-value { 
            font-size: 18px; 
            font-weight: bold; 
            color: #1f2937;
        }
        .roas-highlight { 
            background: linear-gradient(135deg, #7c3aed, #3b82f6); 
            color: white; 
            padding: 30px; 
            border-radius: 12px; 
            text-align: center; 
            margin: 30px 0;
        }
        .roas-value { 
            font-size: 48px; 
            font-weight: bold; 
            margin: 10px 0;
        }
        .insights-section { 
            background: #f9fafb; 
            padding: 25px; 
            border-radius: 12px; 
            margin: 30px 0; 
            border: 1px solid #e5e7eb;
        }
        .insights-title { 
            font-size: 20px; 
            font-weight: bold; 
            margin-bottom: 15px; 
            color: #1f2937;
        }
        .insights-content { 
            white-space: pre-line; 
            line-height: 1.8;
            color: #374151;
        }
        .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e7eb; 
            color: #6b7280;
        }
        .metrics-grid { 
            display: grid; 
            grid-template-columns: repeat(3, 1fr); 
            gap: 20px; 
            margin: 30px 0;
        }
        .metric-card { 
            background: white; 
            padding: 20px; 
            border-radius: 8px; 
            border: 1px solid #e5e7eb; 
            text-align: center;
        }
        .metric-value { 
            font-size: 24px; 
            font-weight: bold; 
            color: #059669;
        }
        .metric-label { 
            color: #6b7280; 
            font-size: 14px; 
            margin-top: 5px;
        }
        @media print {
            body { margin: 20px; }
            .header { page-break-after: avoid; }
        }
    </style>
  </head>
  <body>
    <div class="header">
        <div class="logo">🚀 ROASCalc</div>
        <div class="title">RELATÓRIO DE ANÁLISE ROAS</div>
        <div class="subtitle">Powered by InfinitePay</div>
    </div>
  
    <div class="info-grid">
        <div class="info-item">
            <div class="info-label">Data do Relatório</div>
            <div class="info-value">${new Date().toLocaleDateString("pt-BR")}</div>
        </div>
        <div class="info-item">
            <div class="info-label">Cliente</div>
            <div class="info-value">${escapeHtml(data.nomeUsuario)}</div>
        </div>
        <div class="info-item">
            <div class="info-label">E-mail</div>
            <div class="info-value">${escapeHtml(data.emailUsuario)}</div>
        </div>
        ${
          data.plataforma
            ? `
        <div class="info-item">
            <div class="info-label">Plataforma</div>
            <div class="info-value">${escapeHtml(data.plataforma)}</div>
        </div>
        `
            : ""
        }
    </div>
  
    <div class="roas-highlight">
        <div style="font-size: 18px; margin-bottom: 10px;">SEU ROAS</div>
        <div class="roas-value">${data.roas.toFixed(2)}x</div>
        <div style="font-size: 16px;">Para cada R$ 1,00 investido, você obteve R$ ${data.roas.toFixed(2)} de retorno</div>
    </div>
  
    <div class="metrics-grid">
        <div class="metric-card">
            <div class="metric-value">R$ ${data.valorInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            <div class="metric-label">Investimento Total</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">R$ ${data.receitaGerada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            <div class="metric-label">Receita Gerada</div>
        </div>
        <div class="metric-card">
            <div class="metric-value">R$ ${(data.receitaGerada - data.valorInvestido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
            <div class="metric-label">Lucro Líquido</div>
        </div>
    </div>
  
    <div class="insights-section">
        <div class="insights-title">🤖 Análise e Recomendações</div>
        <div class="insights-content">${escapeHtml(data.insights)}</div>
    </div>
  
    <div class="footer">
        <p><strong>ROASCalc</strong> - Ferramenta de análise de ROAS com IA</p>
        <p>Powered by InfinitePay | Gerado em ${new Date().toLocaleString("pt-BR")}</p>
    </div>
  </body>
  </html>`
  
    return `data:text/html;charset=utf-8;base64,${Buffer.from(htmlContent, "utf8").toString("base64")}`
  }
  
  export function generateComparativePDF(analyses: any[], userName: string): string {
    console.log("📄 Gerando relatório comparativo HTML...")
  
    // Escapar caracteres especiais
    const escapeHtml = (text: string) => {
      if (!text) return ""
      return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;")
    }
  
    const htmlContent = `<!DOCTYPE html>
  <html lang="pt-BR">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Comparativo</title>
    <style>
        @charset "UTF-8";
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            margin: 40px; 
            line-height: 1.6; 
            color: #333;
            background: #fff;
        }
        .header { 
            text-align: center; 
            border-bottom: 3px solid #7c3aed; 
            padding-bottom: 20px; 
            margin-bottom: 30px;
        }
        .logo { 
            font-size: 24px; 
            font-weight: bold; 
            color: #7c3aed; 
            margin-bottom: 10px;
        }
        .title { 
            font-size: 28px; 
            font-weight: bold; 
            margin: 20px 0;
            color: #1f2937;
        }
        .subtitle { 
            color: #666; 
            font-size: 14px;
        }
        .month-card { 
            background: #f8fafc; 
            border: 1px solid #e5e7eb; 
            border-radius: 12px; 
            padding: 25px; 
            margin: 20px 0;
        }
        .month-title { 
            font-size: 20px; 
            font-weight: bold; 
            color: #1f2937; 
            margin-bottom: 15px;
        }
        .metrics-row { 
            display: grid; 
            grid-template-columns: repeat(4, 1fr); 
            gap: 15px;
        }
        .metric { 
            text-align: center; 
            background: white; 
            padding: 15px; 
            border-radius: 8px; 
            border: 1px solid #d1d5db;
        }
        .metric-value { 
            font-size: 18px; 
            font-weight: bold; 
            color: #059669;
        }
        .metric-label { 
            color: #6b7280; 
            font-size: 12px; 
            margin-top: 5px;
        }
        .summary { 
            background: linear-gradient(135deg, #7c3aed, #3b82f6); 
            color: white; 
            padding: 30px; 
            border-radius: 12px; 
            margin: 30px 0; 
            text-align: center;
        }
        .footer { 
            text-align: center; 
            margin-top: 50px; 
            padding-top: 20px; 
            border-top: 2px solid #e5e7eb; 
            color: #6b7280;
        }
        @media print {
            body { margin: 20px; }
            .header { page-break-after: avoid; }
        }
    </style>
  </head>
  <body>
    <div class="header">
        <div class="logo">📊 ROASCalc</div>
        <div class="title">RELATÓRIO COMPARATIVO MENSAL</div>
        <div class="subtitle">Análise de Performance por Período</div>
    </div>
  
    <div style="margin: 30px 0;">
        <p><strong>Cliente:</strong> ${escapeHtml(userName)}</p>
        <p><strong>Data do Relatório:</strong> ${new Date().toLocaleDateString("pt-BR")}</p>
        <p><strong>Período Analisado:</strong> ${analyses.length} meses</p>
    </div>
  
    <div class="summary">
        <h3 style="margin-top: 0;">Resumo Geral</h3>
        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 20px;">
            <div>
                <div style="font-size: 24px; font-weight: bold;">
                    ${analyses.reduce((sum, a) => sum + a.total_analises, 0)}
                </div>
                <div>Total de Análises</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold;">
                    R$ ${analyses.reduce((sum, a) => sum + a.total_investido, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div>Investimento Total</div>
            </div>
            <div>
                <div style="font-size: 24px; font-weight: bold;">
                    R$ ${analyses.reduce((sum, a) => sum + a.total_receita, 0).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </div>
                <div>Receita Total</div>
            </div>
        </div>
    </div>
  
    ${analyses
      .map(
        (analysis) => `
    <div class="month-card">
        <div class="month-title">📅 ${analysis.mes_referencia}</div>
        <div class="metrics-row">
            <div class="metric">
                <div class="metric-value">${analysis.roas_medio.toFixed(2)}x</div>
                <div class="metric-label">ROAS Médio</div>
            </div>
            <div class="metric">
                <div class="metric-value">R$ ${analysis.total_investido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div class="metric-label">Investimento</div>
            </div>
            <div class="metric">
                <div class="metric-value">R$ ${analysis.total_receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div class="metric-label">Receita</div>
            </div>
            <div class="metric">
                <div class="metric-value">R$ ${(analysis.total_receita - analysis.total_investido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</div>
                <div class="metric-label">Lucro</div>
            </div>
        </div>
    </div>
    `,
      )
      .join("")}
  
    <div class="footer">
        <p><strong>ROASCalc</strong> - Relatório Comparativo de Performance</p>
        <p>Powered by InfinitePay | Gerado em ${new Date().toLocaleString("pt-BR")}</p>
    </div>
  </body>
  </html>`
  
    return `data:text/html;charset=utf-8;base64,${Buffer.from(htmlContent, "utf8").toString("base64")}`
  }
  