'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

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

    handleApiError(response, data, 'Erro ao excluir avaliação')

    return data.data
  })
