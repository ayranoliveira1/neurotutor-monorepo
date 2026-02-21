'use server'

import { api, handleApiError } from '@/lib/api'
import type { ExerciseListItem } from './types'

export interface FetchExerciseListsParams {
  page?: number
  perPage?: number
  search?: string
  status?: string
  startDate?: string
  endDate?: string
}

export interface FetchExerciseListsResponse {
  exerciseLists: ExerciseListItem[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export async function fetchExerciseListsAction(
  params: FetchExerciseListsParams = {},
): Promise<FetchExerciseListsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.search) searchParams.set('search', params.search)
  if (params.status) searchParams.set('status', params.status)
  if (params.startDate) searchParams.set('startDate', params.startDate)
  if (params.endDate) searchParams.set('endDate', params.endDate)

  const query = searchParams.toString()
  const endpoint = `/exercise-lists${query ? `?${query}` : ''}`

  const { response, data } = await api<FetchExerciseListsResponse>(endpoint)

  handleApiError(response, data, 'Erro ao buscar listas de exercícios')

  return data.data!
}
