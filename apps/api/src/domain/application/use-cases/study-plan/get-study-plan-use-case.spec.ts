import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { GetStudyPlanUseCase } from './get-study-plan-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: GetStudyPlanUseCase

describe('GetStudyPlanUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new GetStudyPlanUseCase(studyPlansRepository)
  })

  it('deve buscar um plano de estudo por ID', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlan.name).toBe(studyPlan.name)
    }
  })

  it('deve retornar erro se o plano não existe', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: 'non-existent',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se o plano pertence a outro usuário', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-2'),
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
