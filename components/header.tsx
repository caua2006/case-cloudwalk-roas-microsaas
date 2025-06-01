"use client"

import { Button } from "@/components/ui/button"
import { Calculator } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export function Header() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem("token")
    setIsLoggedIn(!!token)
  }, [])

  const handleLoginClick = () => {
    if (isLoggedIn) {
      router.push("/dashboard")
    } else {
      router.push("/dashboard") // Vai abrir o modal de login na página do dashboard
    }
  }

  return (
    <header className="bg-white border-b border-gray-200">
      {/* Barra superior verde */}
      <div className="bg-gradient-to-r from-lime-400 to-green-400 text-black text-sm py-2 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap">
          <span className="mx-8">
            🚀 CALCULE SEU ROAS GRATUITAMENTE | INSIGHTS PERSONALIZADOS COM IA | OTIMIZE SUAS CAMPANHAS AGORA
          </span>
          <span className="mx-8">
            🚀 CALCULE SEU ROAS GRATUITAMENTE | INSIGHTS PERSONALIZADOS COM IA | OTIMIZE SUAS CAMPANHAS AGORA
          </span>
        </div>
      </div>

      {/* Header principal */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center md:gap-2 gap-1">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ROASCalc</span>
          </Link>

          

          <div className="flex items-center gap-4 ml-1 md:ml-0">
            <Button variant="outline" className="md:inline-flex" onClick={handleLoginClick}>
              {isLoggedIn ? "Dashboard" : "Login"}
            </Button>
            <Button className="bg-lime-400 hover:bg-lime-500 text-black font-semibold" onClick={() => router.push("/")}>
              Calcular agora
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
