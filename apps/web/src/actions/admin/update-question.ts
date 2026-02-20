'use server'

import { actionClient } from '@/lib/safe-action'
import { adminUpdateQuestionSchema } from '@/schemas/question'
import { api } from '@/lib/api'

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

    if (!response.ok || !data.success) {
      const errorMsg = Array.isArray(data.error)
        ? data.error
            .map((e: unknown) =>
              typeof e === 'string' ? e : (e as { message?: string }).message,
            )
            .filter(Boolean)
            .join(', ')
        : data.error

      throw new Error(data.message || errorMsg || 'Erro ao atualizar questão')
    }

    return data.data
  })
