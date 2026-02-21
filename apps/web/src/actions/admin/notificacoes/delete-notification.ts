'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const deleteNotificationSchema = z.object({
  id: z.string().min(1),
})

export const adminDeleteNotificationAction = actionClient
  .inputSchema(deleteNotificationSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/admin/notifications/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    handleApiError(response, data, 'Erro ao excluir notificação')

    return data.data
  })
