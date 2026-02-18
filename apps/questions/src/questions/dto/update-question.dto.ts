import { z } from 'zod'

export const updateQuestionSchema = z.object({
  externalId: z.string().min(1).optional(),
  statement: z.string().min(1).optional(),
  imageUrl: z.string().url().nullable().optional(),
  alternatives: z.array(z.string()).min(2).optional(),
  origin: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  correctAnswer: z.number().int().min(0).optional(),
})

export type UpdateQuestionDto = z.infer<typeof updateQuestionSchema>
