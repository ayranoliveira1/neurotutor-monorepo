'use server'

import { actionClient } from '@/lib/safe-action'
import { editStudyPlanSchema } from '@/schemas/study-plan'
import { api, handleApiError } from '@/lib/api'
import type { StudyPlanItem } from './types'
import { z } from 'zod'

const editStudyPlanActionSchema = editStudyPlanSchema.extend({
  id: z.string().min(1),
})

interface EditStudyPlanResponse {
  studyPlan: StudyPlanItem
}

export const editStudyPlanAction = actionClient
  .inputSchema(editStudyPlanActionSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...body } = parsedInput

    const { response, data } = await api<EditStudyPlanResponse>(
      `/study-plans/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(body),
      },
    )

    handleApiError(response, data, 'Erro ao editar plano de estudo')

    return data.data
  })
