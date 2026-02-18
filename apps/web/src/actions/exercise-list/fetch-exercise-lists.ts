'use server'

import { api } from '@/lib/api'
import type { ExerciseListItem } from './types'

export interface FetchExerciseListsParams {
  page?: number
  perPage?: number
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

  const query = searchParams.toString()
  const endpoint = `/exercise-lists${query ? `?${query}` : ''}`

  const { response, data } = await api<FetchExerciseListsResponse>(endpoint)

  if (!response.ok || !data.success) {
    throw new Error('Erro ao buscar listas de exercícios')
  }

  return data.data!
}
