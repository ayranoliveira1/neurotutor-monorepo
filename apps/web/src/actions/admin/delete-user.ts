'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'

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

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Erro ao excluir usuário')
    }

    return data.data
  })
