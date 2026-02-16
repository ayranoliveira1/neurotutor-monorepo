import { z } from 'zod'

export const stringToJSONSchema = z
  .string()
  .transform((str, ctx): z.infer<ReturnType<any>> => {
    try {
      return JSON.parse(str)
    } catch {
      ctx.addIssue({ code: 'custom', message: 'Invalid JSON' })
      return z.NEVER
    }
  })
