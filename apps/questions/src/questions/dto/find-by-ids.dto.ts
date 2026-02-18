import { z } from 'zod'

export const findByIdsSchema = z.object({
  ids: z.array(z.string().uuid()).min(1).max(500),
  includeAnswers: z.boolean().optional().default(false),
})

export type FindByIdsDto = z.infer<typeof findByIdsSchema>
