import { z } from 'zod'
import { Difficulty } from '@/generated/prisma'

export const createQuestionSchema = z.object({
  externalId: z.string().min(1),
  statement: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  alternatives: z.array(z.string()).min(2),
  origin: z.string().min(1),
  subject: z.string().min(1),
  categories: z.array(z.string()),
  correctAnswer: z.number().int().min(0),
  year: z.number().int().min(1900).max(2100).optional(),
  difficulty: z.nativeEnum(Difficulty).optional(),
})

export type CreateQuestionDto = z.infer<typeof createQuestionSchema>
