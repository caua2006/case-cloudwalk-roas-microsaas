"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calculator, DollarSign, TrendingUp } from "lucide-react"
import type { FormData } from "@/types"

interface RoasFormProps {
  onSubmit: (data: FormData) => void
  isLoading?: boolean
}

export function RoasForm({ onSubmit, isLoading }: RoasFormProps) {
  const [formData, setFormData] = useState<FormData>({
    valorInvestido: 0,
    receitaGerada: 0,
    plataformaCampanha: "",
    dataCampanha: "",
  })
  const [errors, setErrors] = useState<{
    valorInvestido?: string
    receitaGerada?: string
  }>({})

  const validateInput = (value: number, field: string): string | undefined => {
    if (value <= 0) {
      return "O valor deve ser maior que zero"
    }
    if (value > 999999999.99) {
      return "O valor máximo permitido é 999.999.999,99"
    }
    return undefined
  }

  const handleInputChange = (field: keyof FormData, value: string | number) => {
    // Para campos de texto (plataforma e data), manter como string
    if (field === "plataformaCampanha" || field === "dataCampanha") {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }))
      return
    }

    // Para campos numéricos
    let numValue = typeof value === "string" ? Number.parseFloat(value) : value

    // Se não for um número válido, use 0
    if (isNaN(numValue)) {
      numValue = 0
    }

    // Validar campos numéricos
    let fieldError
    if (field === "valorInvestido" || field === "receitaGerada") {
      fieldError = validateInput(numValue, field)
      setErrors((prev) => ({
        ...prev,
        [field]: fieldError,
      }))
    }

    setFormData((prev) => ({
      ...prev,
      [field]: numValue,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validar novamente antes de enviar
    const investimentoError = validateInput(formData.valorInvestido, "valorInvestido")
    const receitaError = validateInput(formData.receitaGerada, "receitaGerada")

    if (investimentoError || receitaError) {
      setErrors({
        valorInvestido: investimentoError,
        receitaGerada: receitaError,
      })
      return
    }

    if (formData.valorInvestido > 0 && formData.receitaGerada > 0) {
      onSubmit({
        ...formData,
        valorInvestido: Math.min(Number(formData.valorInvestido), 999999999.99),
        receitaGerada: Math.min(Number(formData.receitaGerada), 999999999.99),
      })
    }
  }

  const roasPreview = formData.valorInvestido > 0 ? formData.receitaGerada / formData.valorInvestido : 0

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Calcule seu ROAS em segundos</h2>
            <p className="text-lg text-gray-600">
              Insira os dados da sua campanha e descubra o retorno sobre investimento
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Formulário */}
            <Card className="border-2 border-purple-100">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calculator className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Dados da Campanha</CardTitle>
                    <CardDescription>Preencha as informações da sua campanha de marketing</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="valorInvestido" className="text-sm font-semibold text-gray-700">
                        Valor Investido (R$) *
                      </Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="valorInvestido"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="999999999.99"
                          required
                          placeholder="1.000,00"
                          className={`pl-10 h-12 ${errors.valorInvestido ? "border-red-500" : ""}`}
                          value={formData.valorInvestido || ""}
                          onChange={(e) => handleInputChange("valorInvestido", e.target.value)}
                        />
                      </div>
                      {errors.valorInvestido && <p className="text-red-500 text-xs mt-1">{errors.valorInvestido}</p>}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="receitaGerada" className="text-sm font-semibold text-gray-700">
                        Receita Gerada (R$) *
                      </Label>
                      <div className="relative">
                        <TrendingUp className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                        <Input
                          id="receitaGerada"
                          type="number"
                          step="0.01"
                          min="0.01"
                          max="999999999.99"
                          required
                          placeholder="2.500,00"
                          className={`pl-10 h-12 ${errors.receitaGerada ? "border-red-500" : ""}`}
                          value={formData.receitaGerada || ""}
                          onChange={(e) => handleInputChange("receitaGerada", e.target.value)}
                        />
                      </div>
                      {errors.receitaGerada && <p className="text-red-500 text-xs mt-1">{errors.receitaGerada}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="plataformaCampanha" className="text-sm font-semibold text-gray-700">
                      Plataforma da Campanha
                    </Label>
                    <Input
                      id="plataformaCampanha"
                      type="text"
                      placeholder="Ex: Google Ads, Facebook, Instagram, TikTok"
                      className="h-12"
                      value={formData.plataformaCampanha || ""}
                      onChange={(e) => handleInputChange("plataformaCampanha", e.target.value)}
                      maxLength={255} // Limitar tamanho do texto
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="dataCampanha" className="text-sm font-semibold text-gray-700">
                      Data da Campanha
                    </Label>
                    <Input
                      id="dataCampanha"
                      type="date"
                      className="h-12"
                      value={formData.dataCampanha || ""}
                      onChange={(e) => handleInputChange("dataCampanha", e.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold h-12"
                    disabled={
                      isLoading ||
                      formData.valorInvestido <= 0 ||
                      formData.receitaGerada <= 0 ||
                      !!errors.valorInvestido ||
                      !!errors.receitaGerada
                    }
                  >
                    {isLoading ? "Analisando..." : "Calcular ROAS Grátis"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Preview */}
            <div className="space-y-6">
              <Card className="bg-gradient-to-br from-purple-50 to-blue-50 border-purple-200">
                <CardContent className="p-6">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview do seu ROAS</h3>
                    <div className="text-4xl font-bold text-purple-600 mb-2">
                      {roasPreview > 0 ? `${roasPreview.toFixed(2)}x` : "0.00x"}
                    </div>
                    <p className="text-sm text-gray-600">
                      {roasPreview >= 3
                        ? "🎉 Excelente resultado!"
                        : roasPreview >= 2
                          ? "✅ Bom resultado!"
                          : roasPreview > 0
                            ? "⚠️ Pode melhorar"
                            : "Preencha os dados acima"}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h4 className="font-semibold text-gray-900 mb-4">O que você vai receber:</h4>
                <ul className="space-y-3 text-sm text-gray-600">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-lime-400 rounded-full"></div>
                    Cálculo preciso do seu ROAS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    Análise detalhada com IA
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    Recomendações personalizadas
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    Estratégias de otimização
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
