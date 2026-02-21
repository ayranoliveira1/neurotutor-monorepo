'use server'

import { api, handleApiError } from '@/lib/api'

export async function fetchYearsAction(): Promise<number[]> {
  const { response, data } = await api<number[]>('/questions/years')

  handleApiError(response, data, 'Erro ao buscar anos')

  return data.data ?? []
}
