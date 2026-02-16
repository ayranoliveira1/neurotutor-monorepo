import { z } from 'zod'

export const createRatingSchema = z.object({
  rating: z.number().int().min(1, 'Selecione uma avaliação').max(5),
  description: z.string().optional().default(''),
})

export type CreateRatingInput = z.infer<typeof createRatingSchema>
