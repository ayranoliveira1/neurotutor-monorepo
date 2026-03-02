import { z } from 'zod'

export const studyPlanGoalSchema = z.object({
  subject: z.string().min(1, 'Selecione uma disciplina'),
  weeklyQuestionsTarget: z.coerce
    .number()
    .int()
    .min(1, 'Mínimo de 1 questão')
    .max(500, 'Máximo de 500 questões'),
  targetAccuracyPercent: z.coerce
    .number()
    .int()
    .min(1, 'Mínimo de 1%')
    .max(100, 'Máximo de 100%')
    .optional()
    .nullable()
    .transform((v) => (v === 0 ? undefined : v)),
})

export const createStudyPlanSchema = z
  .object({
    name: z
      .string()
      .min(1, 'Nome é obrigatório')
      .max(200, 'Nome deve ter no máximo 200 caracteres'),
    description: z.string().max(500).optional().nullable(),
    startDate: z.string().min(1, 'Data de início é obrigatória'),
    endDate: z.string().min(1, 'Data de término é obrigatória'),
    goals: z
      .array(studyPlanGoalSchema)
      .min(1, 'Adicione pelo menos uma meta'),
  })
  .refine((data) => data.endDate > data.startDate, {
    message: 'A data de término deve ser posterior à data de início',
    path: ['endDate'],
  })

export type CreateStudyPlanFormData = z.infer<typeof createStudyPlanSchema>

export const editStudyPlanSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres')
    .optional(),
  description: z.string().max(500).optional().nullable(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  goals: z.array(studyPlanGoalSchema).min(1).optional(),
})

export type EditStudyPlanFormData = z.infer<typeof editStudyPlanSchema>

export const changeStudyPlanStatusSchema = z.object({
  status: z.enum(['COMPLETED', 'ARCHIVED']),
})

export type ChangeStudyPlanStatusFormData = z.infer<
  typeof changeStudyPlanStatusSchema
>
