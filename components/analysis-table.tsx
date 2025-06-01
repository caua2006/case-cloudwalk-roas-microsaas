"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { FileText, ChevronLeft, ChevronRight } from "lucide-react"

interface AnalysisTableProps {
  analyses: any[]
}

export function AnalysisTable({ analyses }: AnalysisTableProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(analyses.length / itemsPerPage)

  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentItems = analyses.slice(startIndex, endIndex)

  const handleViewHTML = (htmlUrl: string) => {
    if (htmlUrl.startsWith("data:text/html;charset=utf-8;base64,")) {
      const base64Data = htmlUrl.split(",")[1]
      const htmlContent = atob(base64Data)
      const blob = new Blob([htmlContent], { type: "text/html;charset=utf-8" })
      const url = URL.createObjectURL(blob)

      const link = document.createElement("a")
      link.href = url
      link.download = `relatorio-roas-${new Date().toISOString().slice(0, 10)}.html`
      link.click()

      URL.revokeObjectURL(url)
    } else {
      window.open(htmlUrl, "_blank")
    }
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Plataforma</th>
              <th className="px-4 py-3">Investimento</th>
              <th className="px-4 py-3">Receita</th>
              <th className="px-4 py-3">ROAS</th>
              <th className="px-4 py-3">Ações</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.length > 0 ? (
              currentItems.map((analysis) => (
                <tr key={analysis.id} className="bg-white border-b hover:bg-gray-50">
                  <td className="px-4 py-3">
                    {new Date(analysis.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">{analysis.plataforma_campanha || "-"}</td>
                  <td className="px-4 py-3">
                    R$ {Number(analysis.valor_investido).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3">
                    R$ {Number(analysis.receita_gerada).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-4 py-3 font-medium">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        Number(analysis.roas) >= 3
                          ? "bg-green-100 text-green-800"
                          : Number(analysis.roas) >= 2
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {Number(analysis.roas).toFixed(2)}x
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewHTML(analysis.pdf_url)}
                      className="text-purple-600 hover:text-purple-800"
                    >
                      <FileText className="h-4 w-4 mr-1" /> HTML
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr className="bg-white border-b">
                <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                  Nenhuma análise encontrada
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Mostrando {startIndex + 1}-{Math.min(endIndex, analyses.length)} de {analyses.length} análises
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
