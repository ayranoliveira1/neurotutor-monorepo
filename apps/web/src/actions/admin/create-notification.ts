'use server'

import { actionClient } from '@/lib/safe-action'
import { adminCreateNotificationSchema } from '@/schemas/notification'
import { api } from '@/lib/api'

interface CreateNotificationResponse {
  notification: { id: string; title: string; content: string }
}

export const createNotificationAction = actionClient
  .inputSchema(adminCreateNotificationSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreateNotificationResponse>(
      '/admin/notifications',
      {
        method: 'POST',
        body: JSON.stringify({
          title: parsedInput.title,
          message: parsedInput.message,
          sendToAll: parsedInput.sendToAll,
          sendIds: parsedInput.sendIds,
        }),
      },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao criar notificação',
      )
    }

    return data.data
  })
