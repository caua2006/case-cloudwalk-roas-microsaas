"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { User, Mail, Building } from "lucide-react"
import type { LeadData } from "@/types"
import { LoadingSequence } from "./loading-sequence"

interface LeadModalProps {
  isOpen: boolean
  onSubmit: (data: LeadData) => void
  isLoading?: boolean
}

export function LeadModal({ isOpen, onSubmit, isLoading }: LeadModalProps) {
  const [step, setStep] = useState<"form" | "loading" | "success">("form")
  const [leadData, setLeadData] = useState<LeadData>({
    nome: "",
    email: "",
    nomeNegocio: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (leadData.nome && leadData.email) {
      setStep("loading")
      onSubmit(leadData)
    }
  }

  const handleLoadingComplete = () => {
    setStep("success")
  }

  const handleClose = () => {
    setStep("form")
    setLeadData({ nome: "", email: "", nomeNegocio: "" })
    // onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        {!isLoading && (
          <>
            <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-purple-600" />
          </div>
          <div>
            <DialogTitle className="text-2xl font-bold text-gray-900">Quase lá! 🚀</DialogTitle>
            <DialogDescription className="text-gray-600 mt-2">
              Para receber sua análise personalizada com IA, precisamos de algumas informações
            </DialogDescription>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-semibold text-gray-700">
              Nome completo *
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nome"
                type="text"
                required
                placeholder="Seu nome completo"
                className="pl-10 h-12"
                value={leadData.nome}
                onChange={(e) =>
                  setLeadData((prev) => ({
                    ...prev,
                    nome: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
              E-mail profissional *
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                required
                placeholder="seu@email.com"
                className="pl-10 h-12"
                value={leadData.email}
                onChange={(e) =>
                  setLeadData((prev) => ({
                    ...prev,
                    email: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="nomeNegocio" className="text-sm font-semibold text-gray-700">
              Nome da empresa
            </Label>
            <div className="relative">
              <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="nomeNegocio"
                type="text"
                placeholder="Nome da sua empresa (opcional)"
                className="pl-10 h-12"
                value={leadData.nomeNegocio}
                onChange={(e) =>
                  setLeadData((prev) => ({
                    ...prev,
                    nomeNegocio: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold h-12"
            disabled={isLoading || !leadData.nome || !leadData.email}
          >
            {isLoading ? "Gerando análise..." : "Receber análise grátis"}
          </Button>

          <p className="text-xs text-gray-500 text-center">Seus dados estão seguros. Não enviamos spam.</p>
        </form>
          </>
        )}

        {isLoading && (
          <>
            <>
            <DialogHeader className="text-center">
              <DialogTitle className="text-2xl font-bold text-gray-900">Gerando sua análise...</DialogTitle>
              <DialogDescription className="text-gray-600">
                Aguarde enquanto processamos suas informações
              </DialogDescription>
            </DialogHeader>
            <LoadingSequence onComplete={handleLoadingComplete} />
          </>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}
