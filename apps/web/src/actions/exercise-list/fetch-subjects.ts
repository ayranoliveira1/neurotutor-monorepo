'use server'

import { api } from '@/lib/api'

export async function fetchSubjectsAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/subjects')

  if (!response.ok) {
    throw new Error('Erro ao buscar disciplinas')
  }

  return data.data ?? []
}
