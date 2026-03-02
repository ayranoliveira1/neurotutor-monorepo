import { describe, it, expect, beforeEach, vi } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { InMemoryStudyPlanGoalProgressRepository } from '@test/repositories/in-memory-study-plan-goal-progress-repository'
import { MakeStudyPlan, MakeStudyPlanGoal } from '@test/factories/make-study-plan'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { OnExerciseListFinished } from './on-exercise-list-finished'
import { UpdateStudyPlanProgressUseCase } from '@/domain/application/use-cases/study-plan/update-study-plan-progress-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { DomainEvents } from '@/core/events/domain-events'
import { waitFor } from '@test/utils/wait-for'

let studyPlansRepository: InMemoryStudyPlansRepository
let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let goalProgressRepository: InMemoryStudyPlanGoalProgressRepository
let updateProgressUseCase: UpdateStudyPlanProgressUseCase

describe('OnExerciseListFinished', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository(
      exerciseListsRepository,
    )
    goalProgressRepository = new InMemoryStudyPlanGoalProgressRepository()
    updateProgressUseCase = new UpdateStudyPlanProgressUseCase(
      studyPlansRepository,
      exerciseAnswersRepository,
      goalProgressRepository,
    )

    DomainEvents.clearHandlers()
    DomainEvents.clearMarkedAggregates()

    // eslint-disable-next-line no-new
    new OnExerciseListFinished(updateProgressUseCase)
  })

  it('deve chamar use case quando evento dispara', async () => {
    const executeSpy = vi.spyOn(updateProgressUseCase, 'execute')

    const userId = new UniqueEntityID('user-1')
    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.IN_PROGRESS,
    })
    exerciseListsRepository.items.push(exerciseList)

    exerciseList.status = ExerciseListStatus.FINISHED
    await exerciseListsRepository.save(exerciseList)

    await waitFor(() => {
      expect(executeSpy).toHaveBeenCalledTimes(1)
    })
  })

  it('deve atualizar progresso via evento na integração', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      goals: [
        MakeStudyPlanGoal({ subject: 'Matemática', weeklyQuestionsTarget: 10 }),
      ],
    })
    studyPlan.goals[0] = MakeStudyPlanGoal({
      studyPlanId: studyPlan.id,
      subject: 'Matemática',
      weeklyQuestionsTarget: 10,
    })
    studyPlansRepository.items.push(studyPlan)

    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.IN_PROGRESS,
      sections: [{ subject: 'Matemática', quantity: 2 }],
      questionIds: ['q1', 'q2'],
      questionSubjectMap: { q1: 'Matemática', q2: 'Matemática' },
      totalQuestions: 2,
      createdAt: now,
    })
    exerciseListsRepository.items.push(exerciseList)

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q2', selectedAnswer: 2, isCorrect: false }),
    )

    exerciseList.status = ExerciseListStatus.FINISHED
    await exerciseListsRepository.save(exerciseList)

    await waitFor(() => {
      expect(goalProgressRepository.items).toHaveLength(1)
      expect(goalProgressRepository.items[0].totalAnswered).toBe(2)
      expect(goalProgressRepository.items[0].correctCount).toBe(1)
    })
  })
})
