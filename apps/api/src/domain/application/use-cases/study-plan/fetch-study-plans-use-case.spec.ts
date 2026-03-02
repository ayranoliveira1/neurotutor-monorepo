import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { FetchStudyPlansUseCase } from './fetch-study-plans-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: FetchStudyPlansUseCase

describe('FetchStudyPlansUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new FetchStudyPlansUseCase(studyPlansRepository)
  })

  it('deve listar planos do usuário com paginação', async () => {
    const userId = new UniqueEntityID('user-1')

    for (let i = 0; i < 15; i++) {
      studyPlansRepository.items.push(MakeStudyPlan({ userId }))
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlans).toHaveLength(10)
      expect(result.value.totalItems).toBe(15)
      expect(result.value.totalPages).toBe(2)
    }
  })

  it('deve filtrar por status', async () => {
    const userId = new UniqueEntityID('user-1')

    studyPlansRepository.items.push(
      MakeStudyPlan({ userId, status: StudyPlanStatus.ACTIVE }),
    )
    studyPlansRepository.items.push(
      MakeStudyPlan({ userId, status: StudyPlanStatus.ARCHIVED }),
    )
    studyPlansRepository.items.push(
      MakeStudyPlan({ userId, status: StudyPlanStatus.COMPLETED }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      status: 'ACTIVE',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlans).toHaveLength(1)
      expect(result.value.studyPlans[0].status).toBe(StudyPlanStatus.ACTIVE)
    }
  })
})
