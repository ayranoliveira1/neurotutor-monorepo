'use server'

import { actionClient } from '@/lib/safe-action'
import { createExerciseListSchema } from '@/schemas/exercise-list'
import { api } from '@/lib/api'
import type { ExerciseListItem } from './types'

interface CreateExerciseListResponse {
  exerciseList: ExerciseListItem
}

export const createExerciseListAction = actionClient
  .inputSchema(createExerciseListSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreateExerciseListResponse>(
      '/exercise-lists',
      {
        method: 'POST',
        body: JSON.stringify(parsedInput),
      },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao criar lista de exercícios',
      )
    }

    return data.data
  })
