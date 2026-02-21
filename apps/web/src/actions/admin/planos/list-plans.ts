'use server'

import { api, handleApiError } from '@/lib/api'

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

  handleApiError(response, data, 'Erro ao listar planos')

  return data.data!.plans
}
