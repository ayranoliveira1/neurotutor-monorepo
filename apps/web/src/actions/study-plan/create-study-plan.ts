'use server'

import { actionClient } from '@/lib/safe-action'
import { createStudyPlanSchema } from '@/schemas/study-plan'
import { api, handleApiError } from '@/lib/api'
import type { StudyPlanItem } from './types'

interface CreateStudyPlanResponse {
  studyPlan: StudyPlanItem
}

export const createStudyPlanAction = actionClient
  .inputSchema(createStudyPlanSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreateStudyPlanResponse>(
      '/study-plans',
      {
        method: 'POST',
        body: JSON.stringify(parsedInput),
      },
    )

    handleApiError(response, data, 'Erro ao criar plano de estudo')

    return data.data
  })
