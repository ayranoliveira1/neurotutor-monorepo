'use server'

import { api } from '@/lib/api'
import type { AdminQuestion } from './list-questions'

interface GetQuestionResponse {
  question: AdminQuestion
}

export async function getQuestionAction(id: string): Promise<AdminQuestion> {
  const { response, data } = await api<GetQuestionResponse>(
    `/admin/questions/${id}`,
  )

  if (!response.ok || !data.success) {
    throw new Error(data.message || data.error || 'Erro ao buscar questão')
  }

  return data.data!.question
}
