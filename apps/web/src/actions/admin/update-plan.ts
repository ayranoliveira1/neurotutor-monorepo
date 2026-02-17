'use server'

import { actionClient } from '@/lib/safe-action'
import { adminUpdatePlanSchema } from '@/schemas/admin'
import { api } from '@/lib/api'

interface UpdatePlanResponse {
  plan: { id: string; name: string; slug: string }
}

export const updatePlanAction = actionClient
  .inputSchema(adminUpdatePlanSchema)
  .action(async ({ parsedInput }) => {
    const { id, active, ...rest } = parsedInput

    const body = {
      ...rest,
      ...(active !== undefined ? { active: active === 'true' } : {}),
    }

    const { response, data } = await api<UpdatePlanResponse>(
      `/admin/plans/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao atualizar plano',
      )
    }

    return data.data
  })
