'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'
import type { ExerciseListItem } from './types'

const finishExerciseListSchema = z.object({
  id: z.string().min(1),
})

export interface FinishExerciseListResponse {
  exerciseList: ExerciseListItem
  correctCount: number
  totalQuestions: number
}

export const finishExerciseListAction = actionClient
  .inputSchema(finishExerciseListSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<FinishExerciseListResponse>(
      `/exercise-lists/${parsedInput.id}/finish`,
      { method: 'POST' },
    )

    handleApiError(response, data, 'Erro ao finalizar lista de exercícios')

    return data.data
  })
