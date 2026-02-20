import { z } from 'zod'

// ─── Schemas do formulário (com transforms/coerce para UI) ──────────────────
// Usados pelo zodResolver no componente do formulário.
// Padrão: signUpFormSchema vs signUpSchema em schemas/auth.ts

export const adminCreateQuestionFormSchema = z.object({
  externalId: z.string().min(1, 'ID externo é obrigatório'),
  statement: z
    .string()
    .min(1, 'Enunciado é obrigatório')
    .min(10, 'Enunciado deve ter no mínimo 10 caracteres'),
  imageUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  alternatives: z
    .array(
      z.object({
        value: z.string().min(1, 'Alternativa não pode ser vazia'),
      }),
    )
    .min(2, 'Mínimo de 2 alternativas')
    .transform((items) => items.map((item) => item.value)),
  origin: z.string().min(1, 'Origem é obrigatória'),
  subject: z.string().min(1, 'Disciplina é obrigatória'),
  categories: z.array(z.string()),
  correctAnswer: z.coerce
    .number({ invalid_type_error: 'Resposta correta é obrigatória' })
    .int()
    .min(0, 'Resposta correta deve ser um índice válido'),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .transform((v) => (v === 0 ? undefined : v)),
  difficulty: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
})

export type AdminCreateQuestionFormInput = z.input<
  typeof adminCreateQuestionFormSchema
>

export const adminUpdateQuestionFormSchema = z.object({
  id: z.string().min(1),
  externalId: z.string().min(1, 'ID externo é obrigatório'),
  statement: z
    .string()
    .min(1, 'Enunciado é obrigatório')
    .min(10, 'Enunciado deve ter no mínimo 10 caracteres'),
  imageUrl: z
    .string()
    .url('URL inválida')
    .optional()
    .or(z.literal('')),
  alternatives: z
    .array(
      z.object({
        value: z.string().min(1, 'Alternativa não pode ser vazia'),
      }),
    )
    .min(2, 'Mínimo de 2 alternativas')
    .transform((items) => items.map((item) => item.value)),
  origin: z.string().min(1, 'Origem é obrigatória'),
  subject: z.string().min(1, 'Disciplina é obrigatória'),
  categories: z.array(z.string()),
  correctAnswer: z.coerce
    .number({ invalid_type_error: 'Resposta correta é obrigatória' })
    .int()
    .min(0, 'Resposta correta deve ser um índice válido'),
  year: z.coerce
    .number()
    .int()
    .min(1900)
    .max(2100)
    .optional()
    .transform((v) => (v === 0 ? undefined : v)),
  difficulty: z
    .string()
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
})

export type AdminUpdateQuestionFormInput = z.input<
  typeof adminUpdateQuestionFormSchema
>

// ─── Schemas do servidor (validam dados já transformados) ───────────────────
// Usados pelo .inputSchema() nas server actions.

export const adminCreateQuestionSchema = z.object({
  externalId: z.string().min(1),
  statement: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal('')),
  alternatives: z.array(z.string()).min(2),
  origin: z.string().min(1),
  subject: z.string().min(1),
  categories: z.array(z.string()),
  correctAnswer: z.number().int().min(0),
  year: z.number().int().min(1900).max(2100).optional(),
  difficulty: z.string().optional(),
})

export type AdminCreateQuestionInput = z.infer<
  typeof adminCreateQuestionSchema
>

export const adminUpdateQuestionSchema = z.object({
  id: z.string().min(1),
  externalId: z.string().min(1),
  statement: z.string().min(10),
  imageUrl: z.string().url().optional().or(z.literal('')),
  alternatives: z.array(z.string()).min(2),
  origin: z.string().min(1),
  subject: z.string().min(1),
  categories: z.array(z.string()),
  correctAnswer: z.number().int().min(0),
  year: z.number().int().min(1900).max(2100).optional(),
  difficulty: z.string().optional(),
})

export type AdminUpdateQuestionInput = z.infer<
  typeof adminUpdateQuestionSchema
>
