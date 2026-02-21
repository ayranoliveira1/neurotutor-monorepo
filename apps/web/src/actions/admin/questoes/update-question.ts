'use server'

import { actionClient } from '@/lib/safe-action'
import { adminUpdateQuestionSchema } from '@/schemas/question'
import { api, handleApiError } from '@/lib/api'

interface UpdateQuestionResponse {
  question: { id: string }
}

export const updateQuestionAction = actionClient
  .inputSchema(adminUpdateQuestionSchema)
  .action(async ({ parsedInput }) => {
    const { id, ...rest } = parsedInput

    const { response, data } = await api<UpdateQuestionResponse>(
      `/admin/questions/${id}`,
      {
        method: 'PUT',
        body: JSON.stringify(rest),
      },
    )

    handleApiError(response, data, 'Erro ao atualizar questão')

    return data.data
  })
