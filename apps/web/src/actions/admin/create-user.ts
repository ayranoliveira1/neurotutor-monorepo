'use server'

import { actionClient } from '@/lib/safe-action'
import { adminCreateUserSchema } from '@/schemas/admin'
import { api } from '@/lib/api'

interface CreateUserResponse {
  user: { id: string; name: string; email: string }
}

export const createUserAction = actionClient
  .inputSchema(adminCreateUserSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreateUserResponse>('/admin/users', {
      method: 'POST',
      body: JSON.stringify(parsedInput),
    })

    if (!response.ok || !data.success) {
      throw new Error(data.message || data.error || 'Erro ao criar usuário')
    }

    return data.data
  })
