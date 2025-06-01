"use client"

import { Button } from "@/components/ui/button"
import { Calculator, LogOut, User } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  user: any
  onLogout: () => void
}

export function DashboardHeader({ user, onLogout }: DashboardHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full flex items-center justify-center">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">ROASCalc</span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-purple-600" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-gray-900">{user.nome}</p>
                  <p className="text-gray-500 text-xs">{user.email}</p>
                </div>
              </div>
              <Button variant="outline" size="sm" onClick={onLogout} className="flex items-center gap-2">
                <LogOut className="w-4 h-4" />
                <span className="hidden md:inline">Sair</span>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
