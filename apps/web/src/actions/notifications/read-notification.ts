'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

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

    handleApiError(response, data, 'Erro ao marcar notificação como lida')

    return data.data
  })
