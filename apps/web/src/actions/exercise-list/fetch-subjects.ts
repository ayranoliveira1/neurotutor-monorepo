'use server'

import { api, handleApiError } from '@/lib/api'

export async function fetchSubjectsAction(): Promise<string[]> {
  const { response, data } = await api<string[]>('/questions/subjects')

  handleApiError(response, data, 'Erro ao buscar disciplinas')

  return data.data ?? []
}
