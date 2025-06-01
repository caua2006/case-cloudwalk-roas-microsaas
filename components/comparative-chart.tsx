"use client"

import { useEffect, useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps,
} from "recharts"

interface ComparativeChartProps {
  data: any[]
}

const formatMes = (mesReferencia: string) => {
  const [ano, mes] = mesReferencia.split("-")
  const meses = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"]
  return `${meses[Number.parseInt(mes) - 1]}/${ano.slice(2)}`
}

const CustomTooltip = ({ active, payload, label }: TooltipProps<number, string>) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium text-gray-900">{label}</p>
        <div className="mt-2 space-y-1">
          <p className="text-sm text-purple-600">
            <span className="font-medium">ROAS:</span> {payload[0].value?.toFixed(2)}x
          </p>
          <p className="text-sm text-blue-600">
            <span className="font-medium">Investimento:</span> R${" "}
            {Number(payload[1].value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
          <p className="text-sm text-green-600">
            <span className="font-medium">Receita:</span> R${" "}
            {Number(payload[2].value).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
          </p>
        </div>
      </div>
    )
  }

  return null
}

export function ComparativeChart({ data }: ComparativeChartProps) {
  const [chartData, setChartData] = useState<any[]>([])

  useEffect(() => {
    if (data && data.length > 0) {
      const formattedData = data.map((item) => ({
        mes: formatMes(item.mes_referencia),
        roas: Number(item.roas_medio.toFixed(2)),
        investimento: Number(item.total_investido),
        receita: Number(item.total_receita),
      }))
      setChartData(formattedData)
    }
  }, [data])

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">Sem dados suficientes para exibir o gráfico</p>
      </div>
    )
  }

  return (
    <div className="h-96">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 20,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="mes" />
          <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
          <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          <Bar yAxisId="left" dataKey="roas" name="ROAS (x)" fill="hsl(var(--chart-1))" radius={[4, 4, 0, 0]} />
          <Bar
            yAxisId="right"
            dataKey="investimento"
            name="Investimento (R$)"
            fill="hsl(var(--chart-2))"
            radius={[4, 4, 0, 0]}
          />
          <Bar yAxisId="right" dataKey="receita" name="Receita (R$)" fill="hsl(var(--chart-3))" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
