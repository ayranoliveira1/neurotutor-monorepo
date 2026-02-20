import { describe, it, expect } from 'vitest'
import {
  adminCreateQuestionFormSchema,
  adminUpdateQuestionFormSchema,
  adminCreateQuestionSchema,
  adminUpdateQuestionSchema,
} from '../question'

// ─── Form Schemas (com transforms/coerce) ─────────────────────────────────

const validFormCreate = {
  externalId: 'ENEM-2025-001',
  statement: 'Qual a capital do Brasil? Selecione a alternativa correta.',
  imageUrl: '',
  alternatives: [
    { value: 'São Paulo' },
    { value: 'Brasília' },
    { value: 'Rio de Janeiro' },
  ],
  origin: 'ENEM',
  subject: 'Geografia',
  categories: ['Capitais', 'Brasil'],
  correctAnswer: 1,
  year: 2025,
  difficulty: 'EASY',
}

describe('adminCreateQuestionFormSchema', () => {
  it('deve validar input completo correto', () => {
    const result = adminCreateQuestionFormSchema.safeParse(validFormCreate)
    expect(result.success).toBe(true)
  })

  it('deve transformar alternatives de objetos para strings', () => {
    const result = adminCreateQuestionFormSchema.safeParse(validFormCreate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.alternatives).toEqual([
        'São Paulo',
        'Brasília',
        'Rio de Janeiro',
      ])
    }
  })

  it('deve rejeitar externalId vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      externalId: '',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar enunciado curto', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      statement: 'Curto',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar enunciado vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      statement: '',
    })
    expect(result.success).toBe(false)
  })

  it('deve aceitar imageUrl vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      imageUrl: '',
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar imageUrl inválida', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      imageUrl: 'not-a-url',
    })
    expect(result.success).toBe(false)
  })

  it('deve aceitar imageUrl válida', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      imageUrl: 'https://example.com/image.png',
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar menos de 2 alternativas', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      alternatives: [{ value: 'Única' }],
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar alternativa vazia', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      alternatives: [{ value: '' }, { value: 'Brasília' }],
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar origin vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      origin: '',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar subject vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      subject: '',
    })
    expect(result.success).toBe(false)
  })

  it('deve coercer correctAnswer de string para number', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      correctAnswer: '2',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.correctAnswer).toBe(2)
    }
  })

  it('deve rejeitar year fora do intervalo', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      year: 0,
    })
    expect(result.success).toBe(false)
  })

  it('deve aceitar year undefined (opcional)', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      year: undefined,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.year).toBeUndefined()
    }
  })

  it('deve aceitar year válido', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      year: 2025,
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.year).toBe(2025)
    }
  })

  it('deve transformar difficulty vazio em undefined', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      difficulty: '',
    })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.difficulty).toBeUndefined()
    }
  })

  it('deve aceitar categories como array vazio', () => {
    const result = adminCreateQuestionFormSchema.safeParse({
      ...validFormCreate,
      categories: [],
    })
    expect(result.success).toBe(true)
  })
})

describe('adminUpdateQuestionFormSchema', () => {
  const validUpdate = { ...validFormCreate, id: 'question-123' }

  it('deve validar input completo correto com id', () => {
    const result = adminUpdateQuestionFormSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
  })

  it('deve rejeitar id vazio', () => {
    const result = adminUpdateQuestionFormSchema.safeParse({
      ...validUpdate,
      id: '',
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar sem id', () => {
    const { id: _, ...withoutId } = validUpdate
    const result = adminUpdateQuestionFormSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })

  it('deve transformar alternatives de objetos para strings', () => {
    const result = adminUpdateQuestionFormSchema.safeParse(validUpdate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.alternatives).toEqual([
        'São Paulo',
        'Brasília',
        'Rio de Janeiro',
      ])
    }
  })

  it('deve rejeitar enunciado curto', () => {
    const result = adminUpdateQuestionFormSchema.safeParse({
      ...validUpdate,
      statement: 'Curto',
    })
    expect(result.success).toBe(false)
  })
})

// ─── Server Schemas (validam dados já transformados) ───────────────────────

const validServerCreate = {
  externalId: 'ENEM-2025-001',
  statement: 'Qual a capital do Brasil? Selecione a alternativa correta.',
  imageUrl: '',
  alternatives: ['São Paulo', 'Brasília', 'Rio de Janeiro'],
  origin: 'ENEM',
  subject: 'Geografia',
  categories: ['Capitais', 'Brasil'],
  correctAnswer: 1,
  year: 2025,
  difficulty: 'EASY',
}

describe('adminCreateQuestionSchema (server)', () => {
  it('deve validar dados já transformados', () => {
    const result = adminCreateQuestionSchema.safeParse(validServerCreate)
    expect(result.success).toBe(true)
  })

  it('deve aceitar alternatives como array de strings', () => {
    const result = adminCreateQuestionSchema.safeParse(validServerCreate)
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.alternatives).toEqual([
        'São Paulo',
        'Brasília',
        'Rio de Janeiro',
      ])
    }
  })

  it('deve aceitar year undefined', () => {
    const result = adminCreateQuestionSchema.safeParse({
      ...validServerCreate,
      year: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('deve aceitar difficulty undefined', () => {
    const result = adminCreateQuestionSchema.safeParse({
      ...validServerCreate,
      difficulty: undefined,
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar alternatives como objetos', () => {
    const result = adminCreateQuestionSchema.safeParse({
      ...validServerCreate,
      alternatives: [{ value: 'A' }, { value: 'B' }],
    })
    expect(result.success).toBe(false)
  })
})

describe('adminUpdateQuestionSchema (server)', () => {
  const validServerUpdate = { ...validServerCreate, id: 'question-123' }

  it('deve validar dados já transformados com id', () => {
    const result = adminUpdateQuestionSchema.safeParse(validServerUpdate)
    expect(result.success).toBe(true)
  })

  it('deve rejeitar sem id', () => {
    const { id: _, ...withoutId } = validServerUpdate
    const result = adminUpdateQuestionSchema.safeParse(withoutId)
    expect(result.success).toBe(false)
  })
})
