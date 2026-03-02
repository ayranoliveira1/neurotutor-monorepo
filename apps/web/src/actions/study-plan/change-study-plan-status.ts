'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api, handleApiError } from '@/lib/api'
import type { StudyPlanItem } from './types'

const changeStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(['COMPLETED', 'ARCHIVED']),
})

interface ChangeStatusResponse {
  studyPlan: StudyPlanItem
}

export const changeStudyPlanStatusAction = actionClient
  .inputSchema(changeStatusSchema)
  .action(async ({ parsedInput }) => {
    const { id, status } = parsedInput

    const { response, data } = await api<ChangeStatusResponse>(
      `/study-plans/${id}/status`,
      {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      },
    )

    handleApiError(
      response,
      data,
      'Erro ao alterar status do plano de estudo',
    )

    return data.data
  })
