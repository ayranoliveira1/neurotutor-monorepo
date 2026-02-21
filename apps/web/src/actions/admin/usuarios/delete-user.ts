'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'

const deleteUserSchema = z.object({
  id: z.string().min(1),
})

export const deleteUserAction = actionClient
  .inputSchema(deleteUserSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<{ message: string }>(
      `/admin/users/${parsedInput.id}`,
      { method: 'DELETE' }
    )

    handleApiError(response, data, 'Erro ao excluir usuário')

    return data.data
  })
