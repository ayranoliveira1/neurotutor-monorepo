'use server'

import { api, handleApiError } from '@/lib/api'

export interface AdminPlan {
  id: string
  name: string
  slug: string
  priceCents: number
  description?: string
  cycle: string
  active: boolean
  canDelete: boolean
  createdAt: string
  updatedAt: string
}

interface ListPlansAdminResponse {
  plans: AdminPlan[]
}

export async function listPlansAdminAction(): Promise<AdminPlan[]> {
  const { response, data } =
    await api<ListPlansAdminResponse>('/admin/plans/manage')

  handleApiError(response, data, 'Erro ao listar planos')

  return data.data!.plans
}
