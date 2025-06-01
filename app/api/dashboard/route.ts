import { type NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase"
import { verifyToken } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const token = request.headers.get("authorization")?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "Token não fornecido" }, { status: 401 })
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json({ error: "Token inválido" }, { status: 401 })
    }

    const supabase = createServerClient()

    // Buscar análises do usuário
    const { data: analises, error } = await supabase
      .from("analises_roas")
      .select(`
        *,
        leads!inner(usuario_id, nome, email)
      `)
      .eq("leads.usuario_id", decoded.userId)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Erro ao buscar análises:", error)
      return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
    }

    // Agrupar por mês para análise comparativa
    const analisesPorMes = analises.reduce((acc: any, analise: any) => {
      const mes = analise.mes_referencia
      if (!acc[mes]) {
        acc[mes] = {
          mes_referencia: mes,
          total_investido: 0,
          total_receita: 0,
          total_analises: 0,
          roas_medio: 0,
        }
      }

      acc[mes].total_investido += Number(analise.valor_investido)
      acc[mes].total_receita += Number(analise.receita_gerada)
      acc[mes].total_analises += 1

      return acc
    }, {})

    // Calcular ROAS médio por mês
    Object.values(analisesPorMes).forEach((mes: any) => {
      mes.roas_medio = mes.total_receita / mes.total_investido
    })

    const comparativoMensal = Object.values(analisesPorMes).sort((a: any, b: any) =>
      a.mes_referencia.localeCompare(b.mes_referencia),
    )

    return NextResponse.json({
      analises,
      comparativoMensal,
      resumo: {
        totalAnalises: analises.length,
        roasMedio:
          analises.length > 0 ? analises.reduce((sum: number, a: any) => sum + Number(a.roas), 0) / analises.length : 0,
        totalInvestido: analises.reduce((sum: number, a: any) => sum + Number(a.valor_investido), 0),
        totalReceita: analises.reduce((sum: number, a: any) => sum + Number(a.receita_gerada), 0),
      },
    })
  } catch (error) {
    console.error("Erro na API dashboard:", error)
    return NextResponse.json({ error: "Erro interno do servidor" }, { status: 500 })
  }
}
