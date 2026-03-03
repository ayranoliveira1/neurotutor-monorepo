'use server'

import { api, handleApiError } from '@/lib/api'
import type {
  FetchFocusedStudySessionsResponse,
  FocusedStudySessionsStats,
} from './types'

export interface FetchFocusedStudySessionsParams {
  page?: number
  perPage?: number
  startDate?: Date
  endDate?: Date
}

export async function fetchFocusedStudySessionsAction(
  params: FetchFocusedStudySessionsParams = {},
): Promise<FetchFocusedStudySessionsResponse> {
  const searchParams = new URLSearchParams()

  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.startDate)
    searchParams.set('startDate', params.startDate.toISOString())
  if (params.endDate)
    searchParams.set('endDate', params.endDate.toISOString())

  const query = searchParams.toString()
  const endpoint = `/focused-study-sessions${query ? `?${query}` : ''}`

  const { response, data } =
    await api<FetchFocusedStudySessionsResponse>(endpoint)

  handleApiError(response, data, 'Erro ao buscar sessões de estudo')

  return data.data!
}

export async function fetchFocusedStudySessionsStatsAction(params: {
  startDate: Date
  endDate: Date
}): Promise<FocusedStudySessionsStats> {
  const searchParams = new URLSearchParams({
    startDate: params.startDate.toISOString(),
    endDate: params.endDate.toISOString(),
  })

  const { response, data } = await api<{ stats: FocusedStudySessionsStats }>(
    `/focused-study-sessions/stats?${searchParams.toString()}`,
  )

  handleApiError(response, data, 'Erro ao buscar estatísticas de estudo')

  return data.data!.stats
}
