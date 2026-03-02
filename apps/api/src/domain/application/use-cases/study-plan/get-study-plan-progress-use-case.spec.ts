import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { InMemoryStudyPlanGoalProgressRepository } from '@test/repositories/in-memory-study-plan-goal-progress-repository'
import { MakeStudyPlan, MakeStudyPlanGoal } from '@test/factories/make-study-plan'
import { MakeStudyPlanGoalProgress } from '@test/factories/make-study-plan-goal-progress'
import { GetStudyPlanProgressUseCase } from './get-study-plan-progress-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'

let studyPlansRepository: InMemoryStudyPlansRepository
let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let goalProgressRepository: InMemoryStudyPlanGoalProgressRepository
let sut: GetStudyPlanProgressUseCase

describe('GetStudyPlanProgressUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository(
      exerciseListsRepository,
    )
    goalProgressRepository = new InMemoryStudyPlanGoalProgressRepository()
    sut = new GetStudyPlanProgressUseCase(
      studyPlansRepository,
      goalProgressRepository,
      exerciseAnswersRepository,
    )
  })

  it('deve calcular progresso do plano de estudo a partir de dados pré-computados', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()
    const startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const endDate = new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000)

    const studyPlan = MakeStudyPlan({
      userId,
      startDate,
      endDate,
      goals: [
        MakeStudyPlanGoal({
          subject: 'Matemática',
          weeklyQuestionsTarget: 10,
          targetAccuracyPercent: 80,
        }),
      ],
    })
    studyPlan.goals[0] = MakeStudyPlanGoal({
      studyPlanId: studyPlan.id,
      subject: 'Matemática',
      weeklyQuestionsTarget: 10,
      targetAccuracyPercent: 80,
    })

    studyPlansRepository.items.push(studyPlan)

    goalProgressRepository.items.push(
      MakeStudyPlanGoalProgress({
        studyPlanId: studyPlan.id,
        goalId: studyPlan.goals[0].id,
        subject: 'Matemática',
        totalAnswered: 3,
        correctCount: 2,
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.goalsProgress).toHaveLength(1)
      const mathProgress = result.value.goalsProgress[0]
      expect(mathProgress.subject).toBe('Matemática')
      expect(mathProgress.totalAnswered).toBe(3)
      expect(mathProgress.correctCount).toBe(2)
      expect(mathProgress.accuracyPercent).toBe(67)
      expect(result.value.overall.totalQuestions).toBe(3)
      expect(result.value.overall.avgAccuracy).toBe(67)
    }
  })

  it('deve auto-completar plano expirado', async () => {
    const userId = new UniqueEntityID('user-1')
    const pastStart = new Date('2025-01-01')
    const pastEnd = new Date('2025-02-01')

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: pastStart,
      endDate: pastEnd,
      status: StudyPlanStatus.ACTIVE,
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(studyPlansRepository.items[0].status).toBe(StudyPlanStatus.COMPLETED)
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

  it('deve retornar progresso zerado quando não há dados pré-computados', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      goals: [
        MakeStudyPlanGoal({
          subject: 'Matemática',
          weeklyQuestionsTarget: 10,
        }),
      ],
    })
    studyPlansRepository.items.push(studyPlan)

    const result = await sut.execute({
      userId: 'user-1',
      studyPlanId: studyPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.goalsProgress[0].totalAnswered).toBe(0)
      expect(result.value.goalsProgress[0].correctCount).toBe(0)
      expect(result.value.overall.totalQuestions).toBe(0)
    }
  })
})
