'use server'

import { actionClient } from '@/lib/safe-action'
import { adminUpdateUserSchema } from '@/schemas/admin'
import { api, handleApiError } from '@/lib/api'

interface UpdateUserResponse {
  user: { id: string; name: string; email: string }
}

export const updateUserAction = actionClient
  .inputSchema(adminUpdateUserSchema)
  .action(async ({ parsedInput }) => {
    const { id, active, ...rest } = parsedInput

    const body = {
      ...rest,
      ...(active !== undefined ? { active: active === 'true' } : {}),
    }

    const { response, data } = await api<UpdateUserResponse>(
      `/admin/users/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      }
    )

    handleApiError(response, data, 'Erro ao atualizar usuário')

    return data.data
  })
