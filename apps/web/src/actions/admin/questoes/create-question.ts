'use server'

import { actionClient } from '@/lib/safe-action'
import { adminCreateQuestionSchema } from '@/schemas/question'
import { api, handleApiError } from '@/lib/api'

interface CreateQuestionResponse {
  question: { id: string; statement: string; subject: string }
}

export const createQuestionAction = actionClient
  .inputSchema(adminCreateQuestionSchema)
  .action(async ({ parsedInput }) => {
    const body = {
      ...parsedInput,
      imageUrl: parsedInput.imageUrl || null,
    }

    const { response, data } = await api<CreateQuestionResponse>(
      '/admin/questions',
      {
        method: 'POST',
        body: JSON.stringify(body),
      }
    )

    handleApiError(response, data, 'Erro ao criar questão')

    return data.data
  })
