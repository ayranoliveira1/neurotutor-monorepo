'use server'

import { api, handleApiError } from '@/lib/api'

export async function fetchDifficultiesAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/difficulties')

  handleApiError(response, data, 'Erro ao buscar dificuldades')

  return data.data ?? []
}
