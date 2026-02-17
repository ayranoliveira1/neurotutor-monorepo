'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'

const deletePlanSchema = z.object({
  id: z.string().min(1),
})

export const deletePlanAction = actionClient
  .inputSchema(deletePlanSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/admin/plans/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao excluir plano',
      )
    }

    return data.data
  })
