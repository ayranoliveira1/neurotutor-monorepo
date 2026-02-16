import { z } from 'zod'

export const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  PORT: z.coerce.number().optional().default(3001),
  ASSAAS_API_KEY: z.string(),
  SUCCESS_REDIRECT_URL: z.string().url(),
  CANCEL_REDIRECT_URL: z.string().url(),
  ASSAAS_WEBHOOK_TOKEN: z.string(),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .optional()
    .default('development'),
})

export type Env = z.infer<typeof envSchema>
