import { describe, it, expect } from 'vitest'
import {
  studyPlanGoalSchema,
  createStudyPlanSchema,
  changeStudyPlanStatusSchema,
} from '../study-plan'

describe('studyPlanGoalSchema', () => {
  it('deve validar meta válida', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: 'Matemática',
      weeklyQuestionsTarget: 10,
    })

    expect(result.success).toBe(true)
  })

  it('deve validar meta com taxa de acertos', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: 'Português',
      weeklyQuestionsTarget: 15,
      targetAccuracyPercent: 80,
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar subject vazio', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: '',
      weeklyQuestionsTarget: 10,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Selecione uma disciplina')
  })

  it('deve rejeitar weeklyQuestionsTarget menor que 1', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: 'Matemática',
      weeklyQuestionsTarget: 0,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Mínimo de 1 questão')
  })

  it('deve rejeitar weeklyQuestionsTarget maior que 500', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: 'Matemática',
      weeklyQuestionsTarget: 501,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Máximo de 500 questões')
  })

  it('deve rejeitar targetAccuracyPercent maior que 100', () => {
    const result = studyPlanGoalSchema.safeParse({
      subject: 'Matemática',
      weeklyQuestionsTarget: 10,
      targetAccuracyPercent: 101,
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Máximo de 100%')
  })
})

describe('createStudyPlanSchema', () => {
  const validGoal = { subject: 'Matemática', weeklyQuestionsTarget: 10 }

  it('deve validar dados completos', () => {
    const result = createStudyPlanSchema.safeParse({
      name: 'Plano ENEM',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      goals: [validGoal],
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar nome vazio', () => {
    const result = createStudyPlanSchema.safeParse({
      name: '',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      goals: [validGoal],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe('Nome é obrigatório')
  })

  it('deve rejeitar endDate <= startDate', () => {
    const result = createStudyPlanSchema.safeParse({
      name: 'Plano',
      startDate: '2026-06-01',
      endDate: '2026-01-01',
      goals: [validGoal],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues.some((i) =>
      i.message.includes('data de término'),
    )).toBe(true)
  })

  it('deve rejeitar goals vazio', () => {
    const result = createStudyPlanSchema.safeParse({
      name: 'Plano',
      startDate: '2026-01-01',
      endDate: '2026-06-01',
      goals: [],
    })

    expect(result.success).toBe(false)
    expect(result.error?.issues[0].message).toBe(
      'Adicione pelo menos uma meta',
    )
  })

  it('deve validar com múltiplas metas', () => {
    const result = createStudyPlanSchema.safeParse({
      name: 'Plano completo',
      description: 'Preparação completa',
      startDate: '2026-01-01',
      endDate: '2026-12-31',
      goals: [
        { subject: 'Matemática', weeklyQuestionsTarget: 20 },
        { subject: 'Português', weeklyQuestionsTarget: 15, targetAccuracyPercent: 80 },
      ],
    })

    expect(result.success).toBe(true)
  })
})

describe('changeStudyPlanStatusSchema', () => {
  it('deve validar status COMPLETED', () => {
    const result = changeStudyPlanStatusSchema.safeParse({
      status: 'COMPLETED',
    })

    expect(result.success).toBe(true)
  })

  it('deve validar status ARCHIVED', () => {
    const result = changeStudyPlanStatusSchema.safeParse({
      status: 'ARCHIVED',
    })

    expect(result.success).toBe(true)
  })

  it('deve rejeitar status ACTIVE', () => {
    const result = changeStudyPlanStatusSchema.safeParse({
      status: 'ACTIVE',
    })

    expect(result.success).toBe(false)
  })

  it('deve rejeitar status inválido', () => {
    const result = changeStudyPlanStatusSchema.safeParse({
      status: 'INVALID',
    })

    expect(result.success).toBe(false)
  })
})
