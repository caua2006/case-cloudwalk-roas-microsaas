"use client"

import { Button } from "@/components/ui/button"
import { TrendingUp, BarChart3, Target } from "lucide-react"

interface HeroSectionProps {
  onStartCalculation: () => void
}

export function HeroSection({ onStartCalculation }: HeroSectionProps) {
  return (
    <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Conteúdo esquerdo */}
          <div className="space-y-8">
            <div className="space-y-4">
              <p className="text-purple-600 font-semibold text-sm uppercase tracking-wide">
                A FERRAMENTA PARA QUEM PRECISA VENDER
              </p>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
                Calcule seu ROAS e{" "}
                <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  maximize seus resultados
                </span>
              </h1>
              <p className="text-lg text-gray-600 leading-relaxed">
                Descubra o retorno real dos seus investimentos em marketing digital e receba insights personalizados com
                IA para otimizar suas campanhas.
              </p>
            </div>

            {/* Métricas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">+500</div>
                <div className="text-sm text-gray-600">Análises feitas</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">98%</div>
                <div className="text-sm text-gray-600">Precisão IA</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">3.2x</div>
                <div className="text-sm text-gray-600">ROAS médio</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">24h</div>
                <div className="text-sm text-gray-600">Suporte</div>
              </div>
            </div>

            <Button
              onClick={onStartCalculation}
              size="lg"
              className="bg-lime-400 hover:bg-lime-500 text-black font-semibold text-lg px-8 py-6 rounded-xl"
            >
              Calcular meu ROAS grátis
            </Button>
          </div>

          {/* Conteúdo direito */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Análise Inteligente</h3>
                    <p className="text-sm text-gray-600">IA avançada para insights precisos</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Relatórios Detalhados</h3>
                    <p className="text-sm text-gray-600">Métricas completas e acionáveis</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Otimização Contínua</h3>
                    <p className="text-sm text-gray-600">Recomendações para melhorar performance</p>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600 mb-1">2.8x</div>
                    <div className="text-sm text-gray-600">Seu ROAS atual</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos decorativos */}
            <div className="absolute -top-4 -right-4 w-20 h-20 bg-lime-400 rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-purple-400 rounded-full opacity-20"></div>
          </div>
        </div>
      </div>
    </section>
  )
}
