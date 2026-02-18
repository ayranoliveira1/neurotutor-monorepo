'use server'

import { actionClient } from '@/lib/safe-action'
import { z } from 'zod'
import { api } from '@/lib/api'
import type { ExerciseAnswerData } from './types'

const answerQuestionActionSchema = z.object({
  exerciseListId: z.string().min(1),
  questionId: z.string().min(1),
  selectedAnswer: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0).optional().default(0),
})

interface AnswerQuestionResponse {
  answer: ExerciseAnswerData
}

export const answerQuestionAction = actionClient
  .inputSchema(answerQuestionActionSchema)
  .action(async ({ parsedInput }) => {
    const { exerciseListId, questionId, selectedAnswer, timeSpentSeconds } =
      parsedInput

    const { response, data } = await api<AnswerQuestionResponse>(
      `/exercise-lists/${exerciseListId}/answer`,
      {
        method: 'POST',
        body: JSON.stringify({ questionId, selectedAnswer, timeSpentSeconds }),
      },
    )

    if (!response.ok || !data.success) {
      throw new Error(
        data.message || data.error || 'Erro ao registrar resposta',
      )
    }

    return data.data
  })
