'use server'

import { api, handleApiError } from '@/lib/api'

export interface AdminQuestion {
  id: string
  externalId: string
  statement: string
  imageUrl: string | null
  alternatives: unknown
  origin: string
  subject: string
  categories: string[]
  correctAnswer: number
  year: number | null
  difficulty: string | null
  createdAt: string
  updatedAt: string
}

export interface ListQuestionsParams {
  page?: number
  perPage?: number
  subject?: string
  year?: string
  difficulty?: string
}

export interface ListQuestionsResponse {
  questions: AdminQuestion[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export async function listQuestionsAction(
  params: ListQuestionsParams = {},
): Promise<ListQuestionsResponse> {
  const searchParams = new URLSearchParams()
  if (params.page) searchParams.set('page', String(params.page))
  if (params.perPage) searchParams.set('perPage', String(params.perPage))
  if (params.subject) searchParams.set('subject', params.subject)
  if (params.year) searchParams.set('year', params.year)
  if (params.difficulty) searchParams.set('difficulty', params.difficulty)

  const query = searchParams.toString()
  const endpoint = `/admin/questions${query ? `?${query}` : ''}`

  const { response, data } = await api<ListQuestionsResponse>(endpoint)

  handleApiError(response, data, 'Erro ao listar questões')

  return data.data!
}
