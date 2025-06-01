"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { RoasForm } from "@/components/roas-form"
import { LeadModal } from "@/components/lead-modal"
import { ResultDisplay } from "@/components/result-display"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { AlertCircle, RefreshCw, Home } from "lucide-react"
import type { FormData, LeadData } from "@/types"

type Step = "hero" | "form" | "lead" | "result" | "error"

interface ResultData {
  roas: number
  insights: string
  valorInvestido: number
  receitaGerada: number
  pdfUrl?: string
  usouIA?: boolean
}

export default function HomePage() {
  const [currentStep, setCurrentStep] = useState<Step>("hero")
  const [formData, setFormData] = useState<FormData | null>(null)
  const [resultData, setResultData] = useState<ResultData | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errorDetails, setErrorDetails] = useState<string | null>(null)

  const handleStartCalculation = () => {
    setCurrentStep("form")
  }

  const handleFormSubmit = (data: FormData) => {
    setFormData(data)
    setCurrentStep("lead")
  }

  const handleLeadSubmit = async (leadData: LeadData) => {
    if (!formData) return

    setIsLoading(true)
    setError(null)
    setErrorDetails(null)

    try {
      console.log("🚀 Iniciando processo de análise...")
      console.log("📊 Dados do formulário:", formData)
      console.log("👤 Dados do lead:", leadData)

      // Validar dados antes de enviar
      if (!leadData.nome || !leadData.email) {
        throw new Error("Nome e email são obrigatórios")
      }

      if (!formData.valorInvestido || !formData.receitaGerada) {
        throw new Error("Valores de investimento e receita são obrigatórios")
      }

      // Salvar lead
      console.log("📝 Salvando lead...")
      const leadResponse = await fetch("/api/save-lead", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      })

      console.log("📊 Status da resposta do lead:", leadResponse.status)
      console.log("📊 Headers da resposta:", Object.fromEntries(leadResponse.headers.entries()))

      if (!leadResponse.ok) {
        let errorMessage = `Erro ${leadResponse.status}`
        let details = `Status: ${leadResponse.status}`

        try {
          const errorText = await leadResponse.text()
          console.error("❌ Erro na resposta do lead:", errorText)

          // Tentar fazer parse como JSON primeiro
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.error || errorMessage
            details = errorJson.details || errorText
          } catch (parseError) {
            // Se não for JSON, usar o texto como está
            errorMessage = errorText.includes("Internal") ? "Erro interno do servidor" : errorText
            details = errorText
          }
        } catch (textError) {
          console.error("❌ Erro ao ler resposta:", textError)
          errorMessage = "Erro de comunicação com o servidor"
          details = "Não foi possível ler a resposta do servidor"
        }

        setError(errorMessage)
        setErrorDetails(details)
        setCurrentStep("error")
        return
      }

      let leadResult
      try {
        leadResult = await leadResponse.json()
      } catch (jsonError) {
        console.error("❌ Erro ao fazer parse do JSON da resposta:", jsonError)
        throw new Error("Resposta inválida do servidor")
      }

      console.log("✅ Lead salvo com sucesso:", leadResult)

      const { leadId } = leadResult

      if (!leadId) {
        throw new Error("ID do lead não foi retornado pelo servidor")
      }

      // Calcular ROAS
      console.log("🧮 Calculando ROAS para lead:", leadId)
      const roasPayload = {
        valorInvestido: formData.valorInvestido,
        receitaGerada: formData.receitaGerada,
        plataformaCampanha: formData.plataformaCampanha || null,
        dataCampanha: formData.dataCampanha || null,
        leadId,
      }
      console.log("📤 Payload ROAS:", roasPayload)

      const roasResponse = await fetch("/api/calculate-roas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(roasPayload),
      })

      console.log("📊 Status da resposta do ROAS:", roasResponse.status)

      if (!roasResponse.ok) {
        let errorMessage = `Erro ${roasResponse.status} no cálculo`
        let details = `Status: ${roasResponse.status}`

        try {
          const errorText = await roasResponse.text()
          console.error("❌ Erro na resposta do ROAS:", errorText)

          // Tentar fazer parse como JSON primeiro
          try {
            const errorJson = JSON.parse(errorText)
            errorMessage = errorJson.error || errorMessage
            details = errorJson.details || errorText
          } catch (parseError) {
            // Se não for JSON, usar o texto como está
            errorMessage = errorText.includes("Internal") ? "Erro interno do servidor" : errorText
            details = errorText
          }
        } catch (textError) {
          console.error("❌ Erro ao ler resposta:", textError)
          errorMessage = "Erro de comunicação com o servidor"
          details = "Não foi possível ler a resposta do servidor"
        }

        setError(errorMessage)
        setErrorDetails(details)
        setCurrentStep("error")
        return
      }

      let roasResult
      try {
        roasResult = await roasResponse.json()
      } catch (jsonError) {
        console.error("❌ Erro ao fazer parse do JSON da resposta ROAS:", jsonError)
        throw new Error("Resposta inválida do servidor para cálculo ROAS")
      }

      console.log("✅ ROAS calculado com sucesso:", roasResult)

      const { roas, insights, pdfUrl, usouIA } = roasResult

      setResultData({
        roas,
        insights,
        valorInvestido: formData.valorInvestido,
        receitaGerada: formData.receitaGerada,
        pdfUrl,
        usouIA,
      })

      setCurrentStep("result")
      console.log("🎉 Processo concluído com sucesso!")
    } catch (error) {
      console.error("💥 Erro completo:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setError(errorMessage)
      setErrorDetails(error instanceof Error ? error.stack || null : null)
      setCurrentStep("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleTryAgain = () => {
    setError(null)
    setErrorDetails(null)
    setCurrentStep("form")
  }

  const handleStartOver = () => {
    setError(null)
    setErrorDetails(null)
    setFormData(null)
    setResultData(null)
    setCurrentStep("hero")
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {currentStep === "hero" && <HeroSection onStartCalculation={handleStartCalculation} />}

      {currentStep === "form" && <RoasForm onSubmit={handleFormSubmit} isLoading={isLoading} />}

      {currentStep === "result" && resultData && <ResultDisplay {...resultData} />}

      {currentStep === "error" && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card className="border-red-200 bg-red-50">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="w-8 h-8 text-red-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Ops! Algo deu errado</h2>
                  <p className="text-gray-700 mb-4 leading-relaxed">{error}</p>

                  {errorDetails && (
                    <details className="text-left bg-gray-100 p-4 rounded-lg mb-6">
                      <summary className="cursor-pointer text-sm font-medium text-gray-600 mb-2">
                        Detalhes técnicos (clique para expandir)
                      </summary>
                      <pre className="text-xs text-gray-500 overflow-auto">{errorDetails}</pre>
                    </details>
                  )}

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button onClick={handleTryAgain} className="bg-purple-600 hover:bg-purple-700 text-white">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Tentar novamente
                    </Button>
                    <Button onClick={handleStartOver} variant="outline">
                      <Home className="mr-2 h-4 w-4" />
                      Começar do início
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500 mt-4">
                    Se o problema persistir, verifique o console do navegador ou entre em contato conosco.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* Modal de Lead */}
      <LeadModal isOpen={currentStep === "lead"} onSubmit={handleLeadSubmit} isLoading={isLoading} />
    </div>
  )
}
