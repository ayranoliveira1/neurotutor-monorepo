import { z } from 'zod'

export const listQuestionsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(100).optional().default(20),
  subject: z.string().optional(),
  origin: z.string().optional(),
})

export type ListQuestionsDto = z.infer<typeof listQuestionsSchema>

export const randomQuestionsSchema = z.object({
  count: z.coerce.number().int().min(1).max(100).optional().default(10),
  subject: z.string().optional(),
  exclude: z
    .union([z.string(), z.array(z.string())])
    .optional()
    .transform((v) => {
      if (!v) return []
      return Array.isArray(v) ? v : [v]
    }),
})

export type RandomQuestionsDto = z.infer<typeof randomQuestionsSchema>
