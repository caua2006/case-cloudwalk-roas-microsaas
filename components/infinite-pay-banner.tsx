"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ArrowRight, Shield, Zap, CreditCard, Smartphone, CheckCircle } from "lucide-react"
import Image from "next/image"

export function InfinitePayBanner() {
  return (
    <section className="py-12 bg-gradient-to-br from-lime-50 via-green-50 to-emerald-50 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-20 h-20 bg-lime-400 rounded-full blur-xl"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-green-400 rounded-full blur-xl"></div>
        <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-emerald-400 rounded-full blur-xl"></div>
      </div>

      <div className="container mx-auto px-4 relative">
        <div className="max-w-3xl mx-auto">
          {/* CTA Card Único e Limpo */}
          <Card className="border-2 border-lime-200 bg-gradient-to-br from-white via-lime-50 to-green-50 shadow-2xl overflow-hidden relative">
            {/* Barra superior */}
            <div className="bg-gradient-to-r from-lime-400 to-green-400 text-black text-sm py-3 px-6 text-center font-semibold">
              🚀 A CONTA COMPLETA PARA QUEM PRECISA VENDER
            </div>

            <div className="p-6 lg:p-8 text-center">
              {/* Logo e título */}
              <div className="flex items-center justify-center gap-3 mb-6">
                <Image 
                src="/logo-infinite-pay.svg"
                 alt="Logo of Infinitepay" 
                 width={200}
                 height={40}
              />
              </div>

              

              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4 leading-tight">
                Potencialize suas vendas com a{" "}
                <span className="bg-gradient-to-r from-purple-600 to-lime-600 bg-clip-text text-transparent">
                  tecnologia InfinitePay
                </span>
              </h2>

              <p className="text-lg text-gray-700 mb-8 leading-relaxed max-w-2xl mx-auto">
                Maquininha, Tap, Link de Pagamento e Conta Digital. Tudo que você precisa para vender mais e receber
                melhor.
              </p>

              {/* Benefícios em grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
                    <Zap className="w-6 h-6 text-purple-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">PIX Grátis</h4>
                  <p className="text-sm text-gray-600">Taxa 0% em todas as transações PIX</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-lime-100 rounded-full flex items-center justify-center mb-3">
                    <CreditCard className="w-6 h-6 text-lime-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Maquininha Smart</h4>
                  <p className="text-sm text-gray-600">Aceite todos os tipos de pagamento</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                    <Smartphone className="w-6 h-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tap no Celular</h4>
                  <p className="text-sm text-gray-600">Transforme seu celular em maquininha</p>
                </div>

                <div className="flex flex-col items-center text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Conta Digital</h4>
                  <p className="text-sm text-gray-600">Gerencie tudo em um só lugar</p>
                </div>
              </div>

              {/* Diferenciais */}
              <div className="bg-gradient-to-r from-purple-50 to-lime-50 rounded-2xl p-4 mb-6 border border-purple-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4">✨ Por que escolher a InfinitePay?</h4>
                <div className="grid md:grid-cols-2 gap-4 text-left">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Receba na hora ou em 1 dia útil</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Antecipação automática inclusa</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Taxas competitivas do mercado</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Suporte especializado RA1000</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Plataforma completa e integrada</span>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">Tecnologia de ponta e segura</span>
                  </div>
                </div>
              </div>

              {/* CTA Principal */}
              <div className="space-y-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-lime-400 to-green-400 hover:from-lime-500 hover:to-green-500 text-black font-bold h-12 text-lg px-4 md:px-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                >
                  <a
                    href="https://infinitepay.io"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3"
                  >
                    Conhecer a InfinitePay
                    <ArrowRight className="w-5 h-5" />
                  </a>
                </Button>

                <p className="text-sm text-gray-600">Descubra como revolucionar seu negócio • Sem compromisso</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </section>
  )
}
