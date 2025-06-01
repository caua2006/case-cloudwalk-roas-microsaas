"use client"

import { Card, CardContent } from "@/components/ui/card"
import { TrendingUp, DollarSign, BarChart3, LineChart } from "lucide-react"

interface OverviewStatsProps {
  data: {
    totalAnalises: number
    roasMedio: number
    totalInvestido: number
    totalReceita: number
  }
}

export function OverviewStats({ data }: OverviewStatsProps) {
  const lucroTotal = data.totalReceita - data.totalInvestido
  const lucroPercentual = data.totalInvestido > 0 ? (lucroTotal / data.totalInvestido) * 100 : 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">ROAS Médio</p>
              <h3 className="text-2xl font-bold text-gray-900">{data.roasMedio.toFixed(2)}x</h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Investimento Total</p>
              <h3 className="text-2xl font-bold text-gray-900">
                R$ {data.totalInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <BarChart3 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Receita Total</p>
              <h3 className="text-2xl font-bold text-gray-900">
                R$ {data.totalReceita.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
              </h3>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
              <LineChart className="w-6 h-6 text-lime-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Lucro Total</p>
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl font-bold text-gray-900">
                  R$ {lucroTotal.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                </h3>
                <span className="text-xs font-medium text-green-600">+{lucroPercentual.toFixed(0)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
