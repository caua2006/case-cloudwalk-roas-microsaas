export interface Lead {
  id?: string
  nome: string
  email: string
  nome_negocio?: string
  created_at?: string
}

export interface AnaliseRoas {
  id?: string
  lead_id: string
  valor_investido: number
  receita_gerada: number
  roas: number
  plataforma_campanha?: string
  data_campanha?: string
  insights_ia?: string
  created_at?: string
}

export interface FormData {
  valorInvestido: number
  receitaGerada: number
  plataformaCampanha?: string
  dataCampanha?: string
}

export interface LeadData {
  nome: string
  email: string
  nomeNegocio?: string
}
