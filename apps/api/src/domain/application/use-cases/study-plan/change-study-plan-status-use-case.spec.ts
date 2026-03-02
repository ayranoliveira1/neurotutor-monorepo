import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { ChangeStudyPlanStatusUseCase } from './change-study-plan-status-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: ChangeStudyPlanStatusUseCase

describe('ChangeStudyPlanStatusUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new ChangeStudyPlanStatusUseCase(studyPlansRepository)
  })

  it('deve arquivar um plano ativo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
      status: StudyPlanStatus.ACTIVE,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      status: StudyPlanStatus.ARCHIVED,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlan.status).toBe(StudyPlanStatus.ARCHIVED)
    }
  })

  it('deve completar um plano ativo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
      status: StudyPlanStatus.ACTIVE,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      status: StudyPlanStatus.COMPLETED,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlan.status).toBe(StudyPlanStatus.COMPLETED)
    }
  })

  it('deve retornar erro ao alterar status de plano não ativo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
      status: StudyPlanStatus.ARCHIVED,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      status: StudyPlanStatus.COMPLETED,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro para transição inválida', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
      status: StudyPlanStatus.ACTIVE,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      status: StudyPlanStatus.ACTIVE,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se o plano não existe', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: 'non-existent',
      status: StudyPlanStatus.ARCHIVED,
    })

    expect(result.isLeft()).toBe(true)
  })
})
