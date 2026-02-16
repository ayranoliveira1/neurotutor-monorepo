'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'

const deleteRatingSchema = z.object({
  id: z.string().min(1),
})

export const deleteRatingAction = actionClient
  .inputSchema(deleteRatingSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/admin/ratings/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao excluir avaliação',
      )
    }

    return data.data
  })
