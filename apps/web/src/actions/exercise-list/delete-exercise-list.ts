'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const deleteExerciseListSchema = z.object({
  id: z.string().min(1),
})

export const deleteExerciseListAction = actionClient
  .inputSchema(deleteExerciseListSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/exercise-lists/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    handleApiError(response, data, 'Erro ao excluir lista de exercícios')

    return data.data
  })
