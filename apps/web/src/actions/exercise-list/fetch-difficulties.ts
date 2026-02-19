'use server'

import { api } from '@/lib/api'

export async function fetchDifficultiesAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/difficulties')

  if (!response.ok) {
    throw new Error('Erro ao buscar dificuldades')
  }

  return data.data ?? []
}
