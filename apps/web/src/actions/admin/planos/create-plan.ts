'use server'

import { actionClient } from '@/lib/safe-action'
import { adminCreatePlanSchema } from '@/schemas/admin'
import { api, handleApiError } from '@/lib/api'

interface CreatePlanResponse {
  plan: { id: string; name: string; slug: string }
}

export const createPlanAction = actionClient
  .inputSchema(adminCreatePlanSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreatePlanResponse>('/admin/plans', {
      method: 'POST',
      body: JSON.stringify(parsedInput),
    })

    handleApiError(response, data, 'Erro ao criar plano')

    return data.data
  })
