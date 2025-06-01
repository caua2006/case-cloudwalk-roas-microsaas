import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  console.log("🚀 API save-lead iniciada")

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

    const { nome, email, nomeNegocio } = body

    console.log("📝 Dados recebidos no save-lead:", { nome, email, nomeNegocio })

    // Validação básica
    if (!nome || !email) {
      console.error("❌ Dados obrigatórios não fornecidos")
      return NextResponse.json({ error: "Nome e email são obrigatórios" }, { status: 400 })
    }

    // Validação de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      console.error("❌ Email inválido:", email)
      return NextResponse.json({ error: "Email inválido" }, { status: 400 })
    }

    // Criar cliente Supabase
    let supabase
    try {
      supabase = createServerClient()
      console.log("✅ Cliente Supabase criado com sucesso")
    } catch (supabaseError) {
      console.error("❌ Erro ao criar cliente Supabase:", supabaseError)
      return NextResponse.json({ error: "Erro de configuração do banco de dados" }, { status: 500 })
    }

    const emailNormalizado = email.trim().toLowerCase()

    // Verificar se o lead já existe com este email - CORRIGIDO para usar .limit(1).maybeSingle()
    console.log("🔍 Verificando se lead já existe com email:", emailNormalizado)
    const { data: existingLeads, error: searchError } = await supabase
      .from("leads")
      .select("id")
      .eq("email", emailNormalizado)
      .limit(1)

    if (searchError) {
      console.error("❌ Erro ao buscar lead existente:", searchError)
      return NextResponse.json({ error: "Erro ao verificar lead existente" }, { status: 500 })
    }

    // Se encontrou leads, usar o primeiro
    if (existingLeads && existingLeads.length > 0) {
      const existingLead = existingLeads[0]
      console.log("✅ Lead já existe, retornando ID existente:", existingLead.id)
      return NextResponse.json({ leadId: existingLead.id })
    }

    // Criar novo lead
    const leadData = {
      nome: nome.trim(),
      email: emailNormalizado,
      nome_negocio: nomeNegocio?.trim() || null,
      usuario_id: null, // Por enquanto, sempre null para usuários anônimos
    }

    // 🔍 NOVA VERIFICAÇÃO: Buscar se existe usuário com este email
    console.log("🔍 Verificando se existe usuário com email:", emailNormalizado)
    const { data: usuarioExistente, error: usuarioError } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", emailNormalizado)
      .maybeSingle()

    if (usuarioError) {
      console.error("❌ Erro ao buscar usuário existente:", usuarioError)
    } else if (usuarioExistente) {
      console.log("✅ Usuário encontrado! Vinculando lead ao usuário:", usuarioExistente.id)
      leadData.usuario_id = usuarioExistente.id
    } else {
      console.log("ℹ️ Nenhum usuário encontrado com este email - lead será anônimo")
    }

    console.log("💾 Criando novo lead:", leadData)

    const { data, error } = await supabase.from("leads").insert(leadData).select().single()

    if (error) {
      console.error("❌ Erro ao salvar lead:", error)

      // Se for erro de duplicação, tentar buscar o lead existente novamente
      if (error.code === "23505") {
        // Unique violation
        console.log("🔄 Erro de duplicação, buscando lead existente...")
        const { data: duplicateLeads } = await supabase
          .from("leads")
          .select("id")
          .eq("email", emailNormalizado)
          .limit(1)

        if (duplicateLeads && duplicateLeads.length > 0) {
          console.log("✅ Lead duplicado encontrado, retornando ID:", duplicateLeads[0].id)
          return NextResponse.json({ leadId: duplicateLeads[0].id })
        }
      }

      return NextResponse.json(
        {
          error: `Erro ao salvar lead: ${error.message}`,
          details: error,
        },
        { status: 500 },
      )
    }

    if (!data || !data.id) {
      console.error("❌ Lead criado mas sem ID retornado:", data)
      return NextResponse.json({ error: "Erro: Lead criado mas ID não retornado" }, { status: 500 })
    }

    console.log("✅ Lead salvo com sucesso:", data.id)
    return NextResponse.json({ leadId: data.id })
  } catch (error) {
    console.error("❌ Erro geral na API save-lead:", error)
    console.error("❌ Stack trace:", error instanceof Error ? error.stack : "Sem stack trace")

    return NextResponse.json(
      {
        error: "Erro interno do servidor",
        details: error instanceof Error ? error.message : "Erro desconhecido",
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    )
  }
}
