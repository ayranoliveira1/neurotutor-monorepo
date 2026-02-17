'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'

const readNotificationSchema = z.object({
  id: z.string().min(1),
})

export const readNotificationAction = actionClient
  .inputSchema(readNotificationSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/notifications/${parsedInput.id}/read`,
      { method: 'PATCH' },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao marcar notificação como lida',
      )
    }

    return data.data
  })
