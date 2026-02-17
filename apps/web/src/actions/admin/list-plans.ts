'use server'

import { api } from '@/lib/api'

export interface Plan {
  id: string
  name: string
  slug: string
  priceCents: number
  description?: string
  cycle: string
  active: boolean
  createdAt: string
  updatedAt: string
}

interface ListPlansResponse {
  plans: Plan[]
}

export async function listPlansAction(): Promise<Plan[]> {
  const { response, data } = await api<ListPlansResponse>('/admin/plans')

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Erro ao listar planos')
  }

  return data.data!.plans
}
