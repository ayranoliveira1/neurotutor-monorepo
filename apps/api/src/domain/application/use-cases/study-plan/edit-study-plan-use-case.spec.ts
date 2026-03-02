import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { MakeStudyPlan } from '@test/factories/make-study-plan'
import { EditStudyPlanUseCase } from './edit-study-plan-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'

let studyPlansRepository: InMemoryStudyPlansRepository
let sut: EditStudyPlanUseCase

describe('EditStudyPlanUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    sut = new EditStudyPlanUseCase(studyPlansRepository)
  })

  it('deve editar um plano de estudo ativo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      name: 'Plano Atualizado',
      goals: [
        { subject: 'Física', weeklyQuestionsTarget: 15 },
      ],
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.studyPlan.name).toBe('Plano Atualizado')
      expect(result.value.studyPlan.goals).toHaveLength(1)
      expect(result.value.studyPlan.goals[0].subject).toBe('Física')
    }
  })

  it('deve retornar erro ao editar plano não ativo', async () => {
    const studyPlan = MakeStudyPlan({
      userId: new UniqueEntityID('user-1'),
      status: StudyPlanStatus.ARCHIVED,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
      name: 'Tentativa',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se o plano não existe', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: 'non-existent',
      name: 'Tentativa',
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
      name: 'Tentativa',
    })

    expect(result.isLeft()).toBe(true)
  })
})
