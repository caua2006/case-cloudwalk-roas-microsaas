import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Cliente para uso no servidor
export const createServerClient = () => {
  const serverUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serverKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  console.log("🔧 Verificando variáveis de ambiente:")
  console.log("- SUPABASE_URL:", serverUrl ? "✅ Definida" : "❌ Não definida")
  console.log("- SERVICE_ROLE_KEY:", serverKey ? "✅ Definida" : "❌ Não definida")

  if (!serverUrl) {
    const error = "NEXT_PUBLIC_SUPABASE_URL não está definida"
    console.error("❌", error)
    throw new Error(error)
  }

  if (!serverKey) {
    const error = "SUPABASE_SERVICE_ROLE_KEY não está definida"
    console.error("❌", error)
    throw new Error(error)
  }

  try {
    const client = createClient(serverUrl, serverKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
    console.log("✅ Cliente Supabase servidor criado com sucesso")
    return client
  } catch (error) {
    console.error("❌ Erro ao criar cliente Supabase:", error)
    throw new Error(`Erro ao conectar com Supabase: ${error instanceof Error ? error.message : "Erro desconhecido"}`)
  }
}
