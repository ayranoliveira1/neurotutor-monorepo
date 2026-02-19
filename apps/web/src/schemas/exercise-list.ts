import { z } from 'zod'

export const exerciseListSectionSchema = z.object({
  subject: z.string().min(1, 'Selecione uma disciplina'),
  origin: z.string().optional(),
  quantity: z.coerce
    .number()
    .int()
    .min(1, 'Mínimo de 1 questão')
    .max(100, 'Máximo de 100 questões'),
  categories: z.array(z.string()).optional(),
  year: z.coerce
    .number()
    .int()
    .optional()
    .transform((v) => (v === 0 ? undefined : v)),
  difficulty: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
})

export const createExerciseListSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(200, 'Nome deve ter no máximo 200 caracteres'),
  shuffleQuestions: z.boolean().optional().default(false),
  ignoreAnswered: z.boolean().optional().default(false),
  sections: z
    .array(exerciseListSectionSchema)
    .min(1, 'Adicione pelo menos uma seção'),
})

export type CreateExerciseListFormData = z.infer<
  typeof createExerciseListSchema
>

export const answerQuestionSchema = z.object({
  questionId: z.string().uuid(),
  selectedAnswer: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0).optional().default(0),
})

export type AnswerQuestionFormData = z.infer<typeof answerQuestionSchema>
