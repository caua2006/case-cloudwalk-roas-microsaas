import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { verifyToken } from "@/lib/auth"
import { generateComparativePDF } from "@/lib/pdf-generator"

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const { comparativoMensal } = await request.json()

    const supabase = createServerClient()

    // Buscar dados do usuário
    const { data: usuario } = await supabase.from("usuarios").select("nome").eq("id", decoded.userId).single()

    // Gerar PDF comparativo HTML
    const pdfData = generateComparativePDF(comparativoMensal, usuario?.nome || "Usuário")

    return NextResponse.json({
      pdfUrl: pdfData,
    })
  } catch (error) {
    console.error("Erro na API generate-comparative-pdf:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
