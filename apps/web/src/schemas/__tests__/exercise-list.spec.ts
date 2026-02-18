import { describe, it, expect } from 'vitest'
import {
  exerciseListSectionSchema,
  createExerciseListSchema,
  answerQuestionSchema,
} from '../exercise-list'

describe('exerciseListSectionSchema', () => {
  it('deve validar seção válida', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: 'Matemática',
      quantity: 10,
    })

    expect(result.success).toBe(true)
  })

  it('deve validar seção com campos opcionais', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: 'Matemática',
      origin: 'ENEM',
      quantity: 5,
      categories: ['Álgebra', 'Geometria'],
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar subject vazio', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: '',
      quantity: 10,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Selecione uma disciplina')
  })

  it('deve rejeitar quantity menor que 1', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: 'Matemática',
      quantity: 0,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Mínimo de 1 questão')
  })

  it('deve rejeitar quantity maior que 100', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: 'Matemática',
      quantity: 101,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Máximo de 100 questões')
  })

  it('deve coercer quantity de string para número', () => {
    const result = exerciseListSectionSchema.safeParse({
      subject: 'Matemática',
      quantity: '15',
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.quantity).toBe(15)
    }
  })
})

describe('createExerciseListSchema', () => {
  const validSection = { subject: 'Matemática', quantity: 10 }

  it('deve validar dados completos', () => {
    const result = createExerciseListSchema.safeParse({
      name: 'Minha Lista',
      sections: [validSection],
    })

    expect(result.success).toBe(true)
  })

  it('deve aplicar defaults para shuffleQuestions e ignoreAnswered', () => {
    const result = createExerciseListSchema.safeParse({
      name: 'Minha Lista',
      sections: [validSection],
    })

    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.shuffleQuestions).toBe(false)
      expect(result.data.ignoreAnswered).toBe(false)
    }
  })

  it('deve rejeitar nome vazio', () => {
    const result = createExerciseListSchema.safeParse({
      name: '',
      sections: [validSection],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Nome é obrigatório')
  })

  it('deve rejeitar nome maior que 200 caracteres', () => {
    const result = createExerciseListSchema.safeParse({
      name: 'A'.repeat(201),
      sections: [validSection],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Nome deve ter no máximo 200 caracteres',
    )
  })

  it('deve rejeitar lista sem seções', () => {
    const result = createExerciseListSchema.safeParse({
      name: 'Minha Lista',
      sections: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Adicione pelo menos uma seção',
    )
  })

  it('deve validar múltiplas seções', () => {
    const result = createExerciseListSchema.safeParse({
      name: 'Lista Completa',
      shuffleQuestions: true,
      ignoreAnswered: true,
      sections: [
        { subject: 'Matemática', quantity: 10 },
        { subject: 'Português', origin: 'ENEM', quantity: 5 },
      ],
    })

    expect(result.success).toBe(true)
  })
})

describe('answerQuestionSchema', () => {
  it('deve validar resposta válida', () => {
    const result = answerQuestionSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      selectedAnswer: 2,
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar questionId que não é UUID', () => {
    const result = answerQuestionSchema.safeParse({
      questionId: 'not-a-uuid',
      selectedAnswer: 0,
    })

    expect(result.success).toBe(false)
  })

  it('deve rejeitar selectedAnswer negativo', () => {
    const result = answerQuestionSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      selectedAnswer: -1,
    })

    expect(result.success).toBe(false)
  })

  it('deve aceitar selectedAnswer 0', () => {
    const result = answerQuestionSchema.safeParse({
      questionId: '550e8400-e29b-41d4-a716-446655440000',
      selectedAnswer: 0,
    })

    expect(result.success).toBe(true)
  })
})
