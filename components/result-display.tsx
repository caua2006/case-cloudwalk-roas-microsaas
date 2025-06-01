"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, ExternalLink, BarChart3, RefreshCw, Download, Sparkles } from "lucide-react"
import { InfinitePayBanner } from "./infinite-pay-banner"

interface ResultDisplayProps {
  roas: number
  insights: string
  valorInvestido: number
  receitaGerada: number
  pdfUrl?: string
  usouIA?: boolean
}

export function ResultDisplay({ roas, insights, valorInvestido, receitaGerada, pdfUrl, usouIA }: ResultDisplayProps) {
  const getRoasColor = (roas: number) => {
    if (roas >= 3) return "bg-green-100 text-green-800 border-green-200"
    if (roas >= 2) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getRoasLabel = (roas: number) => {
    if (roas >= 3) return "🎉 Excelente"
    if (roas >= 2) return "✅ Bom"
    return "⚠️ Precisa Melhorar"
  }

  const lucro = receitaGerada - valorInvestido

  const handleDownloadHTML = () => {
    if (!pdfUrl) {
      console.error("❌ HTML URL não disponível")
      alert("Erro: Relatório não disponível para download")
      return
    }

    try {
      // Processar data URL HTML base64
      if (pdfUrl.startsWith("data:text/html;charset=utf-8;base64,")) {
        console.log("📄 Baixando relatório HTML...")
        const base64Data = pdfUrl.split(",")[1]
        const htmlContent = atob(base64Data)
        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.download = `relatorio-roas-${new Date().toISOString().slice(0, 10)}.html`
        link.click()

        URL.revokeObjectURL(url)
        console.log("✅ Relatório HTML baixado com sucesso!")
      } else {
        // Caso seja outro formato de URL
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = `relatorio-roas-${new Date().toISOString().slice(0, 10)}.html`
        link.click()
      }
    } catch (error) {
      console.error("❌ Erro ao baixar relatório:", error)
      alert("Erro ao baixar o relatório. Tente novamente.")
    }
  }

  return (
    <section className="py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Header dos resultados */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-900">Sua Análise de ROAS</h2>
            <p className="text-lg text-gray-600">
              Análise completa {usouIA ? "gerada por IA" : "personalizada"} para otimizar suas campanhas
            </p>
            {usouIA && (
              <div className="inline-flex items-center gap-2 bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4" />
                Powered by AI
              </div>
            )}
          </div>

          {/* Resultado Principal */}
          <Card className="border-2 border-purple-200 bg-white shadow-xl">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-blue-100">
                <TrendingUp className="h-10 w-10 text-purple-600" />
              </div>
              <CardTitle className="text-4xl font-bold text-gray-900 mb-2">{roas.toFixed(2)}x</CardTitle>
              <CardDescription className="text-lg">
                <Badge className={`${getRoasColor(roas)} text-sm font-semibold px-3 py-1`}>{getRoasLabel(roas)}</Badge>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-600 mb-1">Investimento</div>
                  <div className="text-xl font-bold text-gray-900">
                    R$ {valorInvestido.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-xl">
                  <div className="text-sm font-semibold text-gray-600 mb-1">Receita</div>
                  <div className="text-xl font-bold text-gray-900">
                    R$ {receitaGerada.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
                <div className="text-center p-4 bg-gradient-to-r from-lime-50 to-green-50 rounded-xl border border-lime-200">
                  <div className="text-sm font-semibold text-green-700 mb-1">Lucro</div>
                  <div className="text-xl font-bold text-green-800">
                    R$ {lucro.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-xl border border-purple-200">
                <p className="text-purple-800 font-medium">
                  Para cada R$ 1,00 investido, você obteve R$ {roas.toFixed(2)} de retorno
                </p>
              </div>

              {/* Botão de Download HTML */}
              <div className="flex flex-col justify-center gap-10 items-center  text-center md:flex-row">
              {pdfUrl && (
                
                  <Button onClick={handleDownloadHTML} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Relatório HTML
                  </Button>
                  
                
              )}
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Nova análise
                  </Button>

              </div>
              {/* {pdfUrl && (
                <div className="text-center">
                  <Button onClick={handleDownloadHTML} className="bg-purple-600 hover:bg-purple-700 text-white">
                    <Download className="h-4 w-4 mr-2" />
                    Baixar Relatório HTML
                  </Button>
                  <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Nova análise
                  </Button>
                </div>
              )} */}
              
            </CardContent>
          </Card>

          {/* Insights da IA */}
          <Card className="border border-gray-200 bg-white shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-xl flex items-center justify-center">
                  {usouIA ? (
                    <Sparkles className="w-6 h-6 text-purple-600" />
                  ) : (
                    <BarChart3 className="w-6 h-6 text-purple-600" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-xl text-gray-900 flex items-center gap-2">
                    {usouIA ? "Análise Personalizada com IA" : "Análise Personalizada"}
                    {usouIA && <Sparkles className="w-5 h-5 text-purple-600" />}
                  </CardTitle>
                  <CardDescription>
                    {usouIA
                      ? "Insights avançados gerados por inteligência artificial"
                      : "Insights e recomendações para otimizar suas campanhas"}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-line text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-6 border border-gray-200">
                  {insights}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* CTA InfinitePay */}
          {/* <Card className="border-2 border-lime-200 bg-gradient-to-r from-lime-50 to-green-50 shadow-lg">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Quer potencializar suas vendas?</h3>
              <p className="text-gray-700 mb-6 text-lg">
                Descubra como a InfinitePay pode ajudar seu negócio a crescer ainda mais com as melhores taxas do
                mercado
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild size="lg" className="bg-lime-400 hover:bg-lime-500 text-black font-semibold">
                  <a
                    href="https://infinitepay.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2"
                  >
                    Conheça a InfinitePay
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </Button>
                
              </div>
            </CardContent>
          </Card> */}

          <InfinitePayBanner />
        </div>
      </div>
    </section>
  )
}
