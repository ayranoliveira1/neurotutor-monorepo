'use server'

import { api, handleApiError } from '@/lib/api'

export interface AdminRating {
  id: string
  userId: string
  rating: number
  description: string
  userName: string
  userEmail: string
  createdAt: string
}

export interface ListRatingsParams {
  page?: number
  perPage?: number
}

export interface ListRatingsResponse {
  ratings: AdminRating[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export async function listRatingsAction(
  params: ListRatingsParams = {},
): Promise<ListRatingsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))

  const query = searchParams.toString()
  const endpoint = `/admin/ratings${query ? `?${query}` : ''}`

  const { response, data } = await api<ListRatingsResponse>(endpoint)

  handleApiError(response, data, 'Erro ao listar avaliações')

  return data.data!
}
