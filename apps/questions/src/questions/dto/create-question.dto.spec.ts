import { createQuestionSchema } from './create-question.dto'

describe('createQuestionSchema', () => {
  const validData = {
    externalId: '15433747',
    statement: 'Qual a resposta correta?',
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM 2025',
    subject: 'Arte',
    categories: ['Linguagens artísticas'],
    correctAnswer: 1,
  }

  it('deve validar dados corretos', () => {
    const result = createQuestionSchema.safeParse(validData)
    expect(result.success).toBe(true)
  })

  it('deve aceitar imageUrl', () => {
    const result = createQuestionSchema.safeParse({
      ...validData,
      imageUrl: 'https://example.com/image.png',
    })
    expect(result.success).toBe(true)
  })

  it('deve aceitar imageUrl null', () => {
    const result = createQuestionSchema.safeParse({
      ...validData,
      imageUrl: null,
    })
    expect(result.success).toBe(true)
  })

  it('deve rejeitar sem externalId', () => {
    const { externalId: _, ...data } = validData
    const result = createQuestionSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('deve rejeitar sem statement', () => {
    const { statement: _, ...data } = validData
    const result = createQuestionSchema.safeParse(data)
    expect(result.success).toBe(false)
  })

  it('deve rejeitar com menos de 2 alternativas', () => {
    const result = createQuestionSchema.safeParse({
      ...validData,
      alternatives: ['A'],
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar correctAnswer negativo', () => {
    const result = createQuestionSchema.safeParse({
      ...validData,
      correctAnswer: -1,
    })
    expect(result.success).toBe(false)
  })

  it('deve rejeitar correctAnswer decimal', () => {
    const result = createQuestionSchema.safeParse({
      ...validData,
      correctAnswer: 1.5,
    })
    expect(result.success).toBe(false)
  })
})
