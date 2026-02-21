'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const deleteQuestionSchema = z.object({
  id: z.string().min(1),
})

export const deleteQuestionAction = actionClient
  .inputSchema(deleteQuestionSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/admin/questions/${parsedInput.id}`,
      { method: 'DELETE' }
    )

    handleApiError(response, data, 'Erro ao excluir questão')

    return data.data
  })
