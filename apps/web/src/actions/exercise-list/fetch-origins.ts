'use server'

import { api, handleApiError } from '@/lib/api'

export async function fetchOriginsAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/origins')

  handleApiError(response, data, 'Erro ao buscar origens')

  return data.data ?? []
}
