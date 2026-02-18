'use server'

import { api } from '@/lib/api'

export async function fetchCategoriesAction(
  subject?: string,
): Promise<string[]> {
  const endpoint = subject
    ? `/questions/categories?subject=${encodeURIComponent(subject)}`
    : '/questions/categories'

  const { response, data } = await api<string[]>(endpoint)

  if (!response.ok) {
    throw new Error('Erro ao buscar categorias')
  }

  return data.data ?? []
}
