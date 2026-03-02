import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { DeleteStudyPlanUseCase } from './delete-study-plan-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: DeleteStudyPlanUseCase

describe('DeleteStudyPlanUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new DeleteStudyPlanUseCase(studyPlansRepository)
  })

  it('deve deletar um plano de estudo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(studyPlansRepository.items).toHaveLength(0)
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
    expect(studyPlansRepository.items).toHaveLength(1)
  })
})
