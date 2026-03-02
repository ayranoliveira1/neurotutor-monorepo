'use server'

import { api, handleApiError } from '@/lib/api'
import type { StudyPlanItem } from './types'

export interface FetchStudyPlansParams {
  page?: number
  perPage?: number
  status?: string
}

export interface FetchStudyPlansResponse {
  studyPlans: StudyPlanItem[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export async function fetchStudyPlansAction(
  params: FetchStudyPlansParams = {},
): Promise<FetchStudyPlansResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.status) searchParams.set('status', params.status)

  const query = searchParams.toString()
  const endpoint = `/study-plans${query ? `?${query}` : ''}`

  const { response, data } = await api<FetchStudyPlansResponse>(endpoint)

  handleApiError(response, data, 'Erro ao buscar planos de estudo')

  return data.data!
}
