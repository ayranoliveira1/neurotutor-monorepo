'use server'

import { api, handleApiError } from '@/lib/api'
import type { AdminQuestion } from './list-questions'

interface GetQuestionResponse {
  question: AdminQuestion
}

export async function getQuestionAction(id: string): Promise<AdminQuestion> {
  const { response, data } = await api<GetQuestionResponse>(
    `/admin/questions/${id}`,
  )

  handleApiError(response, data, 'Erro ao buscar questão')

  return data.data!.question
}
