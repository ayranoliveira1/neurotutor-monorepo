import { z } from 'zod'

export const adminCreateUserSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  email: z.string().min(1, 'E-mail é obrigatório').email('E-mail inválido'),
  password: z
    .string()
    .min(1, 'Senha é obrigatória')
    .min(6, 'Senha deve ter no mínimo 6 caracteres'),
  planSlug: z.string().min(1, 'Plano é obrigatório'),
  durationDays: z.coerce
    .number({ invalid_type_error: 'Duração é obrigatória' })
    .int('Duração deve ser um número inteiro')
    .min(1, 'Duração mínima é 1 dia'),
  role: z.enum(['ADMIN', 'STUDENT', 'TEACHER']).optional(),
})

export type AdminCreateUserInput = z.infer<typeof adminCreateUserSchema>

export const adminUpdateUserSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .optional(),
  email: z.string().email('E-mail inválido').optional(),
  role: z.enum(['ADMIN', 'STUDENT', 'TEACHER']).optional(),
  planId: z.string().optional(),
  endDate: z.string().optional(),
  active: z.enum(['true', 'false']).optional(),
})

export type AdminUpdateUserInput = z.infer<typeof adminUpdateUserSchema>

export const adminCreatePlanSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .min(3, 'Nome deve ter no mínimo 3 caracteres'),
  slug: z
    .string()
    .min(1, 'Slug é obrigatório')
    .min(2, 'Slug deve ter no mínimo 2 caracteres'),
  priceCents: z.coerce
    .number({ invalid_type_error: 'Preço é obrigatório' })
    .min(0, 'Preço deve ser positivo'),
  description: z.string().optional(),
  cycle: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']).default('MONTHLY'),
})

export type AdminCreatePlanInput = z.infer<typeof adminCreatePlanSchema>

export const adminUpdatePlanSchema = z.object({
  id: z.string().min(1),
  name: z
    .string()
    .min(3, 'Nome deve ter no mínimo 3 caracteres')
    .optional(),
  slug: z
    .string()
    .min(2, 'Slug deve ter no mínimo 2 caracteres')
    .optional(),
  priceCents: z.coerce.number().min(0, 'Preço deve ser positivo').optional(),
  description: z.string().optional(),
  cycle: z.enum(['WEEKLY', 'MONTHLY', 'YEARLY']).optional(),
  active: z.enum(['true', 'false']).optional(),
})

export type AdminUpdatePlanInput = z.infer<typeof adminUpdatePlanSchema>
