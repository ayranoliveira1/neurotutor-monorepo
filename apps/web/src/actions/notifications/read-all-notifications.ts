'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const readAllNotificationsSchema = z.object({})

export const readAllNotificationsAction = actionClient
  .inputSchema(readAllNotificationsSchema)
  .action(async () => {
    const { response, data } = await api<{ message: string }>(
      '/notifications/read-all',
      { method: 'PATCH' },
    )

    handleApiError(response, data, 'Erro ao marcar todas notificações como lidas')

    return data.data
  })
