'use server'

import { api, handleApiError } from '@/lib/api'

export interface AdminUserSubscription {
  id: string
  planId: string
  planName: string
  endDate: string
  active: boolean
}

export interface AdminUser {
  id: string
  name: string
  email: string
  cpfCnpj?: string
  phone?: string
  image: string | null
  role: string | null
  emailVerified: boolean
  createdAt: string
  updatedAt: string
  subscription: AdminUserSubscription | null
}

export interface ListUsersParams {
  page?: number
  perPage?: number
  search?: string
  role?: string
  active?: string
  planId?: string
  startDate?: string
  endDate?: string
}

export interface ListUsersResponse {
  users: AdminUser[]
  totalItems: number
  totalPages: number
  currentPage: number
  offset: number
}

export async function listUsersAction(
  params: ListUsersParams = {}
): Promise<ListUsersResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.search) searchParams.set('search', params.search)
  if (params.role) searchParams.set('role', params.role)
  if (params.active) searchParams.set('active', params.active)
  if (params.planId) searchParams.set('planId', params.planId)
  if (params.startDate) searchParams.set('startDate', params.startDate)
  if (params.endDate) searchParams.set('endDate', params.endDate)

  const query = searchParams.toString()
  const endpoint = `/admin/users${query ? `?${query}` : ''}`

  const { response, data } = await api<ListUsersResponse>(endpoint)

  handleApiError(response, data, 'Erro ao listar usuários')

  return data.data!
}
