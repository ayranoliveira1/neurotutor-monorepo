'use server'

import { api, handleApiError } from '@/lib/api'
import type { ExerciseListItem, QuestionData } from './types'

export interface GetExerciseListResponse {
  exerciseList: ExerciseListItem
  questions: QuestionData[]
  answeredMap: Record<string, number>
  timeMap: Record<string, number>
}

export async function getExerciseListAction(
  id: string,
): Promise<GetExerciseListResponse> {
  const { response, data } = await api<GetExerciseListResponse>(
    `/exercise-lists/${id}`,
  )

  handleApiError(response, data, 'Erro ao buscar lista de exercícios')

  return data.data!
}
