'use server'

import { actionClient } from '@/lib/safe-action'
import { createRatingSchema } from '@/schemas/rating'
import { api } from '@/lib/api'

interface CreateRatingResponse {
  rating: {
    id: string
    userId: string
    rating: number
    description: string
    createdAt: string
  }
}

export const createRatingAction = actionClient
  .inputSchema(createRatingSchema)
  .action(async ({ parsedInput }) => {
    const { response, data } = await api<CreateRatingResponse>('/ratings', {
      method: 'POST',
      body: JSON.stringify(parsedInput),
    })

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao enviar avaliação',
      )
    }

    return data.data
  })
