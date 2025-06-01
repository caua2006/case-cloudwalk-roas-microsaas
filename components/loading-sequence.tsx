"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { CheckCircle, FileText, Brain, Calculator, User } from "lucide-react"

interface LoadingStep {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
  color: string
  bgColor: string
  darkBgColor: string
}

const LOADING_STEPS: LoadingStep[] = [
  {
    id: "info",
    title: "Carregando informações",
    description: "Processando dados...",
    icon: <User className="w-4 h-4" />,
    duration: 2000, // Mantendo a duração original
    color: "text-purple-700",
    bgColor: "bg-purple-600",
    darkBgColor: "bg-purple-800",
  },
  {
    id: "roas",
    title: "Calculando ROAS",
    description: "Analisando métricas...",
    icon: <Calculator className="w-4 h-4" />,
    duration: 2500, // Mantendo a duração original
    color: "text-blue-700",
    bgColor: "bg-blue-600",
    darkBgColor: "bg-blue-800",
  },
  {
    id: "ai",
    title: "Gerando insights",
    description: "Criando recomendações...",
    icon: <Brain className="w-4 h-4" />,
    duration: 3000, // Mantendo a duração original
    color: "text-emerald-700",
    bgColor: "bg-emerald-600",
    darkBgColor: "bg-emerald-800",
  },
  {
    id: "pdf",
    title: "Finalizando",
    description: "Preparando relatório...",
    icon: <FileText className="w-4 h-4" />,
    duration: 2000, // Mantendo a duração original
    color: "text-orange-700",
    bgColor: "bg-orange-600",
    darkBgColor: "bg-orange-800",
  },
]

interface LoadingSequenceProps {
  onComplete: () => void
}

export function LoadingSequence({ onComplete }: LoadingSequenceProps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [isCompleted, setIsCompleted] = useState(false)

  useEffect(() => {
    if (currentStepIndex >= LOADING_STEPS.length) {
      setIsCompleted(true)
      setTimeout(onComplete, 500)
      return
    }

    const currentStep = LOADING_STEPS[currentStepIndex]
    const timer = setTimeout(() => {
      setCurrentStepIndex((prev) => prev + 1)
    }, currentStep.duration)

    return () => clearTimeout(timer)
  }, [currentStepIndex, onComplete])

  const currentStep = LOADING_STEPS[currentStepIndex]
  const progress = ((currentStepIndex + 1) / LOADING_STEPS.length) * 100

  if (isCompleted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[250px] p-6">
        <div className="relative">
          {/* Círculo de sucesso compacto */}
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-full flex items-center justify-center shadow-xl transform animate-bounce-fast">
            <CheckCircle className="w-8 h-8 text-white drop-shadow-lg" />
          </div>

          {/* Partículas rápidas */}
          <div className="absolute -top-1 -left-1 w-2 h-2 bg-amber-600 rounded-full animate-ping-fast"></div>
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-rose-600 rounded-full animate-ping-fast delay-100"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-blue-700 rounded-full animate-ping-fast delay-200"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-purple-700 rounded-full animate-ping-fast delay-300"></div>
        </div>

        <h3 className="text-xl font-bold text-gray-900 mt-4 animate-fade-in-fast">Pronto! 🎉</h3>
        <p className="text-gray-600 mt-1 text-sm animate-fade-in-fast delay-100">Análise concluída</p>
      </div>
    )
  }

  if (!currentStep) return null

  return (
    <div className="flex flex-col items-center justify-center min-h-[250px] p-6">
      {/* Barra de progresso compacta */}
      <div className="w-full max-w-xs mb-8">
        <div className="w-full bg-gray-300 rounded-full h-1">
          <div
            className="bg-gradient-to-r from-slate-700 to-slate-900 h-1 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-600 mt-1">
          <span>
            {currentStepIndex + 1}/{LOADING_STEPS.length}
          </span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Ícone principal compacto e ULTRA rápido */}
      <div className="relative mb-6">
        {/* Círculo principal menor */}
        <div
          className={`w-16 h-16 ${currentStep.darkBgColor} rounded-full flex items-center justify-center shadow-xl transform transition-all duration-300 ease-out animate-float-fast animate-pulse-glow-fast`}
        >
          <div className="w-14 h-14 bg-gradient-to-tl from-white/30 to-transparent rounded-full flex items-center justify-center">
            <div className={`text-white transform animate-icon-dance-fast`}>{currentStep.icon}</div>
          </div>
        </div>

        {/* Anéis orbitais ULTRA rápidos */}
        <div className="absolute inset-0 rounded-full border border-slate-600/40 animate-spin-fast"></div>
        <div className="absolute inset-1 rounded-full border border-slate-700/30 animate-spin-reverse-fast"></div>

        {/* Partículas micro com movimento ULTRA rápido */}
        <div className="absolute top-1 right-2 w-1 h-1 bg-slate-600 rounded-full animate-float-particle-fast"></div>
        <div className="absolute bottom-2 left-1 w-1 h-1 bg-slate-700 rounded-full animate-float-particle-fast delay-100"></div>
        <div className="absolute top-3 left-2 w-1 h-1 bg-slate-800 rounded-full animate-float-particle-fast delay-200"></div>
        <div className="absolute bottom-1 right-3 w-1 h-1 bg-slate-600 rounded-full animate-float-particle-fast delay-300"></div>
        <div className="absolute top-0 right-0 w-1 h-1 bg-slate-700 rounded-full animate-float-particle-fast delay-150"></div>
        <div className="absolute bottom-0 left-0 w-1 h-1 bg-slate-800 rounded-full animate-float-particle-fast delay-250"></div>
      </div>

      {/* Texto compacto */}
      <div className="text-center max-w-sm animate-fade-in-up-fast">
        <h3 className="text-lg font-bold text-gray-900 mb-1">{currentStep.title}</h3>
        <p className="text-gray-600 text-sm">{currentStep.description}</p>
      </div>

      {/* Indicador de loading micro com pulsação ULTRA rápida */}
      <div className="flex items-center gap-1 mt-4">
        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse-fast"></div>
        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse-fast delay-100"></div>
        <div className="w-1.5 h-1.5 bg-slate-700 rounded-full animate-pulse-fast delay-200"></div>
      </div>
    </div>
  )
}
