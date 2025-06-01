import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { verifyPassword, generateToken } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()

    if (!email || !senha) {
      return NextResponse.json({ error: "Email e senha são obrigatórios" }, { status: 400 })
    }

    const supabase = createServerClient()

    // Buscar usuário
    const { data: user, error } = await supabase.from("usuarios").select("*").eq("email", email).single()

    if (error || !user) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Verificar senha
    const senhaValida = await verifyPassword(senha, user.senha_hash)

    if (!senhaValida) {
      return NextResponse.json({ error: "Credenciais inválidas" }, { status: 401 })
    }

    // Gerar token
    const token = generateToken(user.id)

    return NextResponse.json({
      user: { id: user.id, nome: user.nome, email: user.email },
      token,
    })
  } catch (error) {
    console.error("Erro na API login:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
