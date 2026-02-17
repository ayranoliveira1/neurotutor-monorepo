'use server'

import { api } from '@/lib/api'

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

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Erro ao listar planos')
  }

  return data.data!.plans
}
