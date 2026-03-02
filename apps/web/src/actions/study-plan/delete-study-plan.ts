'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const deleteStudyPlanSchema = z.object({
  id: z.string().min(1),
})

export const deleteStudyPlanAction = actionClient
  .inputSchema(deleteStudyPlanSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/study-plans/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    handleApiError(response, data, 'Erro ao excluir plano de estudo')

    return data.data
  })
