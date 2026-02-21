'use server'

import { api, handleApiError } from '@/lib/api'

export interface SubjectStats {
  subject: string
  count: number
}

export interface QuestionsStats {
  total: number
  bySubject: SubjectStats[]
}

export async function getQuestionsStatsAction(): Promise<QuestionsStats> {
  const { response, data } = await api<{ stats: QuestionsStats }>(
    '/admin/questions/stats',
  )

  handleApiError(response, data, 'Erro ao buscar estatísticas de questões')

  return data.data!.stats
}
