'use server'

import { api } from '@/lib/api'

export async function fetchYearsAction(): Promise<number[]> {
  const { response, data } = await api<number[]>('/questions/years')

  if (!response.ok) {
    throw new Error('Erro ao buscar anos')
  }

  return data.data ?? []
}
