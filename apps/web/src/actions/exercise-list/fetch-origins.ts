'use server'

import { api } from '@/lib/api'

export async function fetchOriginsAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/origins')

  if (!response.ok) {
    throw new Error('Erro ao buscar origens')
  }

  return data.data ?? []
}
