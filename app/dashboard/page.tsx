"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AuthModal } from "@/components/auth-modal"
import { DashboardHeader } from "@/components/dashboard-header"
import { OverviewStats } from "@/components/overview-stats"
import { AnalysisTable } from "@/components/analysis-table"
import { ComparativeChart } from "@/components/comparative-chart"
import { Backpack, Download, LogIn, RefreshCw, StepBack } from "lucide-react"
import Link from "next/link"

export default function DashboardPage() {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [token, setToken] = useState<string | null>(null)
  const [dashboardData, setDashboardData] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Verificar se o usuário está autenticado
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("token")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      fetchDashboardData(storedToken)
    } else {
      setIsAuthModalOpen(true)
      setIsLoading(false)
    }
  }, [])

  const fetchDashboardData = async (authToken: string) => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/dashboard", {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Erro ao carregar dados do dashboard")
      }

      const data = await response.json()
      setDashboardData(data)
    } catch (err) {
      console.error("Erro ao buscar dados do dashboard:", err)
      setError(err instanceof Error ? err.message : "Erro ao carregar dados")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAuthSuccess = (userData: any, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("token", authToken)
    fetchDashboardData(authToken)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    setUser(null)
    setToken(null)
    setDashboardData(null)
    setIsAuthModalOpen(true)
  }

  const handleRefresh = () => {
    if (token) {
      fetchDashboardData(token)
    }
  }

  const handleGenerateComparativeHTML = async () => {
    if (!token || !dashboardData?.comparativoMensal) return

    try {
      const response = await fetch("/api/generate-comparative-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          comparativoMensal: dashboardData.comparativoMensal,
        }),
      })

      if (!response.ok) {
        throw new Error("Erro ao gerar relatório comparativo")
      }

      const { pdfUrl } = await response.json()

      // Processar data URL HTML base64
      if (pdfUrl.startsWith("data:text/html;charset=utf-8;base64,")) {
        const base64Data = pdfUrl.split(",")[1]
        const htmlContent = atob(base64Data)
        const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
        const url = URL.createObjectURL(blob)

        const link = document.createElement("a")
        link.href = url
        link.download = `relatorio-comparativo-${new Date().toISOString().slice(0, 10)}.html`
        link.click()

        URL.revokeObjectURL(url)
      } else {
        const link = document.createElement("a")
        link.href = pdfUrl
        link.download = `relatorio-comparativo-${new Date().toISOString().slice(0, 10)}.html`
        link.click()
      }
    } catch (err) {
      console.error("Erro ao gerar relatório:", err)
      alert("Erro ao gerar relatório comparativo")
    }
  }

  if (isLoading && !dashboardData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando seu dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-8">
        {error ? (
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-6">
              <p className="text-red-600">{error}</p>
              <Button onClick={handleRefresh} variant="outline" className="mt-4">
                <RefreshCw className="mr-2 h-4 w-4" /> Tentar novamente
              </Button>
            </CardContent>
          </Card>
        ) : dashboardData ? (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard de Análises</h1>
                <p className="text-gray-600">Acompanhe o desempenho das suas campanhas</p>
              </div>
              <div className="flex gap-4">
                <Link href={'/'}>
                <Button onClick={handleRefresh} variant="outline" size="sm">
                  <RefreshCw className="mr-2 h-4 w-4" /> Gerar novo cálculo
                </Button>
                </Link>
                <Button onClick={handleGenerateComparativeHTML} size="sm" className="bg-purple-600 hover:bg-purple-700">
                  <Download className="mr-2 h-4 w-4" /> Relatório HTML
                </Button>
              </div>
            </div>

            <OverviewStats data={dashboardData.resumo} />

            <Tabs defaultValue="comparative">
              <TabsList className="grid w-full grid-cols-2 md:w-auto">
                <TabsTrigger value="comparative">Análise Comparativa</TabsTrigger>
                <TabsTrigger value="history">Histórico de Análises</TabsTrigger>
              </TabsList>
              <TabsContent value="comparative" className="space-y-6 pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Evolução Mensal do ROAS</CardTitle>
                    <CardDescription>Comparativo de desempenho mês a mês</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ComparativeChart data={dashboardData.comparativoMensal} />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="history" className="pt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Histórico de Análises</CardTitle>
                    <CardDescription>Todas as análises realizadas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AnalysisTable analyses={dashboardData.analises} />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600">Faça login para visualizar seu dashboard</p>
            <div>
            <Button onClick={() => window.location.reload()} variant="outline" className="mt-4">
                <LogIn className="mr-2 h-4 w-4" /> Faça login
              </Button>
              <Button onClick={() => router.back()} variant="outline" className="mt-4">
                <StepBack className="mr-2 h-4 w-4" /> Voltar
              </Button>
            </div>
          </div>
        )}
      </main>

      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} onSuccess={handleAuthSuccess} />
    </div>
  )
}
