import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { hashPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { nome, email, senha } = await request.json()

    if (!nome || !email || !senha) {
      return NextResponse.json({ error: "Todos os campos são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()
    const emailNormalizado = email.trim().toLowerCase()

    // Verificar se usuário já existe
    const { data: existingUser } = await supabase
      .from("usuarios")
      .select("id")
      .eq("email", emailNormalizado)
      .maybeSingle()

    if (existingUser) {
      return NextResponse.json({ error: "Email já cadastrado" }, { status: 400 })
    }

    // Hash da senha
    const senhaHash = await hashPassword(senha)

    // Criar usuário
    const { data: user, error } = await supabase
      .from("usuarios")
      .insert({
        nome: nome.trim(),
        email: emailNormalizado,
        senha_hash: senhaHash,
      })
      .select()
      .single()

    if (error) {
      console.error("Erro ao criar usuário:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    console.log("✅ Usuário criado com sucesso:", user.id)

    // 🔗 INTEGRAR LEADS EXISTENTES COM O NOVO USUÁRIO
    try {
      console.log("🔍 Buscando leads existentes para o email:", emailNormalizado)

      // Buscar todos os leads com este email que não têm usuario_id
      const { data: leadsExistentes, error: leadsError } = await supabase
        .from("leads")
        .select("id")
        .eq("email", emailNormalizado)
        .is("usuario_id", null)

      if (leadsError) {
        console.error("❌ Erro ao buscar leads existentes:", leadsError)
      } else if (leadsExistentes && leadsExistentes.length > 0) {
        console.log(`📝 Encontrados ${leadsExistentes.length} leads para vincular ao usuário`)

        // Atualizar todos os leads para vincular ao novo usuário
        const { error: updateError } = await supabase
          .from("leads")
          .update({ usuario_id: user.id })
          .eq("email", emailNormalizado)
          .is("usuario_id", null)

        if (updateError) {
          console.error("❌ Erro ao vincular leads ao usuário:", updateError)
        } else {
          console.log(`✅ ${leadsExistentes.length} leads vinculados com sucesso ao usuário ${user.id}`)
        }
      } else {
        console.log("ℹ️ Nenhum lead existente encontrado para vincular")
      }
    } catch (integrationError) {
      console.error("❌ Erro na integração de leads:", integrationError)
      // Não falhar o registro por causa da integração
    }

    // Gerar token
    const token = generateToken(user.id)

    return NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email },
      token,
    })
  } catch (error) {
    console.error("Erro na API register:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
