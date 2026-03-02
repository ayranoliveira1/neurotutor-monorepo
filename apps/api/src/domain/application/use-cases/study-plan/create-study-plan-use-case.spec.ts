import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { CreateStudyPlanUseCase } from './create-study-plan-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: CreateStudyPlanUseCase

describe('CreateStudyPlanUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new CreateStudyPlanUseCase(studyPlansRepository)
  })

  it('deve criar um plano de estudo com sucesso', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Plano ENEM',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-01'),
      goals: [
        { subject: 'Matemática', weeklyQuestionsTarget: 20 },
        { subject: 'Português', weeklyQuestionsTarget: 15, targetAccuracyPercent: 80 },
      ],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlan.name).toBe('Plano ENEM')
      expect(result.value.studyPlan.goals).toHaveLength(2)
    }
    expect(studyPlansRepository.items).toHaveLength(1)
  })

  it('deve retornar erro se já existe plano ativo', async () => {
    const existingPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
    })
    studyPlansRepository.items.push(existingPlan)

    const result = await sut.execute({
      userId: 'user-1',
      name: 'Outro plano',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-01'),
      goals: [{ subject: 'Matemática', weeklyQuestionsTarget: 10 }],
    })

    expect(result.isLeft()).toBe(true)
    expect(studyPlansRepository.items).toHaveLength(1)
  })

  it('deve retornar erro se endDate <= startDate', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Plano inválido',
      startDate: new Date('2026-06-01'),
      endDate: new Date('2026-01-01'),
      goals: [{ subject: 'Matemática', weeklyQuestionsTarget: 10 }],
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se houver disciplinas duplicadas', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Plano duplicado',
      startDate: new Date('2026-01-01'),
      endDate: new Date('2026-06-01'),
      goals: [
        { subject: 'Matemática', weeklyQuestionsTarget: 10 },
        { subject: 'Matemática', weeklyQuestionsTarget: 20 },
      ],
    })

    expect(result.isLeft()).toBe(true)
  })
})
