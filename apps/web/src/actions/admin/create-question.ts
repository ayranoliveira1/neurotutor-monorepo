'use server'

import { actionClient } from '@/lib/safe-action'
import { adminCreateQuestionSchema } from '@/schemas/question'
import { api } from '@/lib/api'

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

    console.log('API Response:', { response, data })

    if (!response.ok || !data.success) {
      const errorMsg = Array.isArray(data.error)
        ? data.error
            .map((e: unknown) =>
              typeof e === 'string' ? e : (e as { message?: string }).message
            )
            .filter(Boolean)
            .join(', ')
        : data.error

      throw new Error(data.message || errorMsg || 'Erro ao criar questão')
    }

    return data.data
  })
