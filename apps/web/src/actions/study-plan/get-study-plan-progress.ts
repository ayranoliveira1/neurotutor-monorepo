'use server'

import { api, handleApiError } from '@/lib/api'
import type { StudyPlanProgressResponse } from './types'

export async function getStudyPlanProgressAction(
  id: string,
): Promise<StudyPlanProgressResponse> {
  const { response, data } =
    await api<StudyPlanProgressResponse>(`/study-plans/${id}/progress`)

  handleApiError(
    response,
    data,
    'Erro ao buscar progresso do plano de estudo',
  )

  return data.data!
}
