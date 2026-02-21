'use server'

import { api, handleApiError } from '@/lib/api'
import type {
  ExerciseListItem,
  QuestionWithAnswer,
  ExerciseAnswerData,
} from './types'

export interface GetExerciseListResultResponse {
  exerciseList: ExerciseListItem
  questions: QuestionWithAnswer[]
  answers: ExerciseAnswerData[]
}

export async function getExerciseListResultAction(
  id: string,
): Promise<GetExerciseListResultResponse> {
  const { response, data } = await api<GetExerciseListResultResponse>(
    `/exercise-lists/${id}/result`,
  )

  handleApiError(response, data, 'Erro ao buscar resultado da lista')

  return data.data!
}
