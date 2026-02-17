'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'

const deleteNotificationSchema = z.object({
  id: z.string().min(1),
})

export const deleteNotificationAction = actionClient
  .inputSchema(deleteNotificationSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/notifications/${parsedInput.id}`,
      { method: 'DELETE' },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao excluir notificação',
      )
    }

    return data.data
  })
