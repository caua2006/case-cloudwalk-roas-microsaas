import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { generateROASPDF } from "@/lib/pdf-generator"
import OpenAI from "openai"
import { formatInsights, formatInsightsForDisplay } from "@/lib/format-insights"

// Inicializar OpenAI
let openai: OpenAI | null = null
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
  console.log("✅ OpenAI inicializado com sucesso")
} else {
  console.warn("⚠️ OPENAI_API_KEY não encontrada - usando insights estáticos")
}

export async function POST(request: NextRequest) {
  try {
    // Verificar Content-Type
    const contentType = request.headers.get("content-type")
    if (!contentType || !contentType.includes("application/json")) {
      console.error("❌ Content-Type inválido:", contentType)
      return NextResponse.json({ error: "Content-Type deve ser application/json" }, { status: 400 })
    }

    // Verificar se o body existe
    let body
    try {
      const bodyText = await request.text()
      if (!bodyText) {
        console.error("❌ Body vazio")
        return NextResponse.json({ error: "Body da requisição está vazio" }, { status: 400 })
      }
      body = JSON.parse(bodyText)
    } catch (parseError) {
      console.error("❌ Erro ao fazer parse do JSON:", parseError)
      return NextResponse.json({ error: "JSON inválido no body da requisição" }, { status: 400 })
    }

    const { valorInvestido, receitaGerada, leadId, plataformaCampanha, dataCampanha } = body

    console.log("📊 Dados recebidos no calculate-roas:", {
      valorInvestido,
      receitaGerada,
      leadId,
      plataformaCampanha,
      dataCampanha,
    })

    if (!valorInvestido || !receitaGerada || !leadId) {
      return NextResponse.json({ error: "Dados obrigatórios não fornecidos" }, { status: 400 })
    }

    // Validar e limitar valores numéricos para evitar overflow
    const investimento = Math.min(Number(valorInvestido), 999999999.99)
    const receita = Math.min(Number(receitaGerada), 999999999.99)

    // Verificar se os valores são válidos
    if (isNaN(investimento) || isNaN(receita) || investimento <= 0 || receita < 0) {
      return NextResponse.json({ error: "Valores numéricos inválidos" }, { status: 400 })
    }

    // Calcular ROAS com precisão limitada
    const roas = Number((receita / investimento).toFixed(4))

    console.log(`💰 ROAS calculado: ${roas.toFixed(2)}x`)

    // 🤖 GERAR INSIGHTS COM OPENAI - PRIORIDADE MÁXIMA!
    let insights = ""
    let insightsBeforeFormat = ""
    let usouIA = false

    if (openai) {
      try {
        console.log("🤖 Gerando insights com OpenAI...")

        const prompt = `
Você é um especialista em marketing digital e análise de ROI com mais de 10 anos de experiência. Analise esta campanha de marketing:

DADOS DA CAMPANHA:
- Investimento: R$ ${investimento.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
- Receita Gerada: R$ ${receita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
- ROAS: ${roas.toFixed(2)}x
${plataformaCampanha ? `- Plataforma: ${plataformaCampanha}` : ""}
${dataCampanha ? `- Data da Campanha: ${new Date(dataCampanha).toLocaleDateString("pt-BR")}` : ""}

FORNEÇA UMA ANÁLISE COMPLETA E DETALHADA COM:

1. **CLASSIFICAÇÃO DO DESEMPENHO** (Excelente/Bom/Regular/Ruim) com emoji
2. **ANÁLISE DETALHADA** do resultado obtido (mínimo 3 parágrafos)
3. **BENCHMARKS DO MERCADO** para comparação específica da plataforma
4. **5 RECOMENDAÇÕES ESPECÍFICAS** para otimização (numeradas)
5. **PRÓXIMOS PASSOS** estratégicos (3 ações concretas)
6. **ALERTAS E OPORTUNIDADES** baseados no ROAS atual

IMPORTANTE:
- Use linguagem profissional mas acessível
- Seja específico e acionável nas recomendações
- Inclua números e percentuais quando relevante
- Mencione estratégias específicas para a plataforma informada
- Responda em português brasileiro
- Use formatação clara com **negrito** para destacar pontos importantes
- Seja detalhado e forneça valor real ao usuário

Análise:
        `

        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          max_tokens: 1500,
          temperature: 0.7,
        })

        insightsBeforeFormat = completion.choices[0]?.message?.content || "Não foi possível gerar insights no momento."
        
        insights = formatInsights(insightsBeforeFormat)

        usouIA = true
        console.log("✅ Insights gerados com OpenAI com sucesso!")
      } catch (openaiError) {
        console.error("❌ Erro na OpenAI:", openaiError)
        insights = getFallbackInsights(roas, plataformaCampanha)
        usouIA = false
      }
    } else {
      insightsBeforeFormat = getFallbackInsights(roas, plataformaCampanha)
      insights = formatInsights(insightsBeforeFormat)
      
      usouIA = false
      console.log("📝 Usando insights estáticos (OpenAI não configurada)")
    }

    // Buscar dados do lead para o PDF
    const supabase = createServerClient()

    // Verificar se o lead existe
    const { data: leadExists } = await supabase.from("leads").select("id").eq("id", leadId).maybeSingle()

    if (!leadExists) {
      return NextResponse.json({ error: "Lead não encontrado" }, { status: 404 })
    }

    const { data: leadData } = await supabase.from("leads").select("nome, email").eq("id", leadId).single()

    // 📄 GERAR PDF REAL COM HTML
    const pdfData = generateROASPDF({
      roas,
      valorInvestido: investimento,
      receitaGerada: receita,
      insights,
      plataforma: plataformaCampanha,
      dataCampanha,
      nomeUsuario: leadData?.nome || "Usuário",
      emailUsuario: leadData?.email || "",
    })
    
    

    // Determinar mês de referência
    const mesReferencia = dataCampanha
      ? new Date(dataCampanha).toISOString().slice(0, 7)
      : new Date().toISOString().slice(0, 7)

    try {
      const { data, error } = await supabase
        .from("analises_roas")
        .insert({
          lead_id: leadId,
          valor_investido: investimento.toFixed(2),
          receita_gerada: receita.toFixed(2),
          roas: roas.toFixed(2),
          plataforma_campanha: plataformaCampanha || null,
          data_campanha: dataCampanha || null,
          insights_ia: insights,
          mes_referencia: mesReferencia,
          pdf_url: "Apenas para rodar",
        })
        .select()
        .single()

      if (error) {
        console.error("❌ Erro ao salvar análise:", error)
        return NextResponse.json({ error: `Erro ao salvar análise: ${error.message}` }, { status: 500 })
      }

      console.log("✅ Análise salva com sucesso:", data.id)

      insights = formatInsightsForDisplay(insights)

      return NextResponse.json({
        roas: roas,
        insights: insights,
        analiseId: data.id,
        pdfUrl: pdfData,
        usouIA: usouIA, // Informar se usou IA
      })
    } catch (dbError) {
      console.error("❌ Erro ao inserir no banco:", dbError)
      return NextResponse.json({ error: `Erro ao inserir no banco: ${String(dbError)}` }, { status: 500 })
    }
  } catch (error) {
    console.error("❌ Erro na API calculate-roas:", error)
    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
      },
      { status: 500 },
    )
  }
}

// Função para gerar insights estáticos DETALHADOS baseados no ROAS
function getFallbackInsights(roas: number, plataforma?: string): string {
  const plataformaInfo = plataforma ? ` na ${plataforma}` : ""

  if (roas >= 4) {
    return `**🎉 EXCELENTE RESULTADO!**

Seu ROAS de ${roas.toFixed(2)}x${plataformaInfo} está muito acima da média do mercado e representa uma performance excepcional.

**📊 ANÁLISE DETALHADA:**
Sua campanha está performando no top 5% do mercado. Com um retorno de R$ ${roas.toFixed(2)} para cada R$ 1,00 investido, você está extraindo valor máximo do seu investimento. Este resultado indica uma combinação perfeita de segmentação precisa, criativos eficazes e otimização contínua.

A margem de lucro atual permite escalabilidade agressiva sem comprometer a rentabilidade. Campanhas com ROAS acima de 4x geralmente indicam product-market fit forte e audiência altamente qualificada.

**🎯 BENCHMARKS DO MERCADO:**
- Média geral do setor: 2-3x
- Top 10% das campanhas: >4x
- Sua campanha: ${roas.toFixed(2)}x (Elite tier)
${plataforma ? `- Média específica ${plataforma}: 2.5-3.5x` : ""}

**🚀 RECOMENDAÇÕES ESPECÍFICAS:**

1. **ESCALE IMEDIATAMENTE** - Aumente o orçamento em 50-100% mantendo a mesma estratégia
2. **REPLIQUE A FÓRMULA** - Duplique esta campanha para outros produtos/serviços
3. **EXPANDA AUDIÊNCIAS** - Teste públicos similares (lookalike) baseados nos conversores atuais
4. **DOCUMENTE TUDO** - Registre todos os elementos: criativos, copy, segmentação, horários
5. **TESTE INCREMENTALMENTE** - Faça pequenos testes A/B para otimizar ainda mais

**📈 PRÓXIMOS PASSOS:**
- Aumentar orçamento gradualmente (20-30% por semana)
- Criar campanhas similares para outros canais
- Implementar automações para manter a performance

**⚠️ ALERTAS:**
- Monitore de perto para evitar saturação da audiência
- Prepare criativos de backup para manter o desempenho
- Considere diversificar canais para reduzir dependência`
  } else if (roas >= 2) {
    return `**✅ BOM RESULTADO!**

Seu ROAS de ${roas.toFixed(2)}x${plataformaInfo} está dentro da média esperada do mercado e representa uma base sólida para crescimento.

**📊 ANÁLISE DETALHADA:**
Sua campanha está gerando retorno positivo e sustentável. Com cada R$ 1,00 investido retornando R$ ${roas.toFixed(2)}, você está no caminho certo, mas há espaço significativo para otimização e melhoria da performance.

Este nível de ROAS indica que sua estratégia básica está funcionando, mas alguns elementos podem ser refinados para alcançar resultados superiores. A margem atual permite investimentos em otimização sem risco de prejuízo.

**🎯 BENCHMARKS DO MERCADO:**
- Média geral do setor: 2-3x
- Campanhas medianas: 1.5-2.5x
- Sua campanha: ${roas.toFixed(2)}x (Dentro da média)
${plataforma ? `- Média específica ${plataforma}: 2.5-3.5x` : ""}

**🔧 RECOMENDAÇÕES ESPECÍFICAS:**

1. **OTIMIZE CRIATIVOS** - Teste novos formatos, imagens e copy para melhorar CTR
2. **REFINE SEGMENTAÇÃO** - Exclua audiências de baixa performance e foque nos melhores segmentos
3. **MELHORE LANDING PAGE** - Otimize a página de destino para aumentar taxa de conversão
4. **TESTE HORÁRIOS** - Experimente diferentes horários e dias da semana
5. **A/B TEST OFERTAS** - Teste diferentes propostas de valor e CTAs

**📈 PRÓXIMOS PASSOS:**
- Manter orçamento atual enquanto otimiza
- Identificar e pausar segmentos de baixo desempenho
- Implementar melhorias semanais incrementais

**🎯 OPORTUNIDADES:**
- Potencial para chegar a 3-4x com otimizações
- Espaço para aumentar orçamento após melhorias
- Possibilidade de expandir para novos públicos`
  } else {
    return `**⚠️ RESULTADO ABAIXO DO ESPERADO**

Seu ROAS de ${roas.toFixed(2)}x${plataformaInfo} está abaixo da média do mercado e requer atenção imediata para otimização.

**📊 ANÁLISE DETALHADA:**
Sua campanha está gerando retorno baixo, indicando possíveis problemas na estratégia, execução ou segmentação. Com retorno de apenas R$ ${roas.toFixed(2)} para cada R$ 1,00 investido, há risco de prejuízo se mantido sem ajustes significativos.

Este resultado sugere desalinhamento entre oferta e audiência, problemas nos criativos, ou questões na página de conversão. É crucial identificar e corrigir os gargalos rapidamente.

**🎯 BENCHMARKS DO MERCADO:**
- Média geral do setor: 2-3x
- Campanhas de baixo desempenho: <1.5x
- Sua campanha: ${roas.toFixed(2)}x (Abaixo da média)
${plataforma ? `- Média específica ${plataforma}: 2.5-3.5x` : ""}

**🚨 RECOMENDAÇÕES URGENTES:**

1. **REVISE PÚBLICO-ALVO** - Pode estar muito amplo, inadequado ou saturado
2. **REFORMULE CRIATIVOS** - Teste formatos completamente diferentes e mensagens mais diretas
3. **AUDITORIA COMPLETA** - Revise todo o funil: anúncio → landing page → checkout
4. **REDUZA CUSTOS** - Pause segmentos de pior performance imediatamente
5. **ANALISE CONCORRÊNCIA** - Estude o que está funcionando no seu mercado

**📈 PRÓXIMOS PASSOS:**
- Reduzir orçamento temporariamente (50%)
- Fazer auditoria completa da campanha
- Implementar mudanças significativas na estratégia

**🔴 ALERTAS CRÍTICOS:**
- Risco de prejuízo se mantido sem mudanças
- Necessidade de revisão completa da estratégia
- Considere pausar e repensar a abordagem`
  }
}
