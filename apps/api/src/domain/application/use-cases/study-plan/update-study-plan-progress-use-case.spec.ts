import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryStudyPlansRepository } from '@test/repositories/in-memory-study-plans-repository'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { InMemoryStudyPlanGoalProgressRepository } from '@test/repositories/in-memory-study-plan-goal-progress-repository'
import { MakeStudyPlan, MakeStudyPlanGoal } from '@test/factories/make-study-plan'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { UpdateStudyPlanProgressUseCase } from './update-study-plan-progress-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

let studyPlansRepository: InMemoryStudyPlansRepository
let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let goalProgressRepository: InMemoryStudyPlanGoalProgressRepository
let sut: UpdateStudyPlanProgressUseCase

describe('UpdateStudyPlanProgressUseCase', () => {
  beforeEach(() => {
    studyPlansRepository = new InMemoryStudyPlansRepository()
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository(
      exerciseListsRepository,
    )
    goalProgressRepository = new InMemoryStudyPlanGoalProgressRepository()
    sut = new UpdateStudyPlanProgressUseCase(
      studyPlansRepository,
      exerciseAnswersRepository,
      goalProgressRepository,
    )
  })

  it('deve atualizar progresso quando plano ativo existe e subject combina', async () => {
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
    studyPlansRepository.items.push(studyPlan)

    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      sections: [{ subject: 'Matemática', quantity: 3 }],
      questionIds: ['q1', 'q2', 'q3'],
      questionSubjectMap: { q1: 'Matemática', q2: 'Matemática', q3: 'Matemática' },
      totalQuestions: 3,
      createdAt: now,
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q2', selectedAnswer: 2, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q3', selectedAnswer: 3, isCorrect: false }),
    )

    const result = await sut.execute({ exerciseList })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.updated).toBe(true)
    }

    expect(goalProgressRepository.items).toHaveLength(1)
    expect(goalProgressRepository.items[0].totalAnswered).toBe(3)
    expect(goalProgressRepository.items[0].correctCount).toBe(2)
  })

  it('não deve atualizar sem plano ativo', async () => {
    const userId = new UniqueEntityID('user-1')
    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
    })

    const result = await sut.execute({ exerciseList })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.updated).toBe(false)
    }
  })

  it('não deve atualizar se lista criada ANTES do plano', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: now,
      endDate: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
      createdAt: now,
      goals: [
        MakeStudyPlanGoal({ subject: 'Matemática', weeklyQuestionsTarget: 10 }),
      ],
    })
    studyPlansRepository.items.push(studyPlan)

    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      sections: [{ subject: 'Matemática', quantity: 2 }],
      questionIds: ['q1', 'q2'],
      questionSubjectMap: { q1: 'Matemática', q2: 'Matemática' },
      totalQuestions: 2,
      createdAt: new Date(now.getTime() - 24 * 60 * 60 * 1000),
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
    )

    const result = await sut.execute({ exerciseList })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.updated).toBe(false)
    }
    expect(goalProgressRepository.items).toHaveLength(0)
  })

  it('deve incrementar progresso existente (acumular)', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      goals: [
        MakeStudyPlanGoal({ subject: 'Matemática', weeklyQuestionsTarget: 20 }),
      ],
    })
    studyPlansRepository.items.push(studyPlan)

    const list1 = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      sections: [{ subject: 'Matemática', quantity: 2 }],
      questionIds: ['q1', 'q2'],
      questionSubjectMap: { q1: 'Matemática', q2: 'Matemática' },
      totalQuestions: 2,
      createdAt: now,
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: list1.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: list1.id, questionId: 'q2', selectedAnswer: 2, isCorrect: false }),
    )

    await sut.execute({ exerciseList: list1 })

    expect(goalProgressRepository.items[0].totalAnswered).toBe(2)
    expect(goalProgressRepository.items[0].correctCount).toBe(1)

    const list2 = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      sections: [{ subject: 'Matemática', quantity: 1 }],
      questionIds: ['q3'],
      questionSubjectMap: { q3: 'Matemática' },
      totalQuestions: 1,
      createdAt: now,
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: list2.id, questionId: 'q3', selectedAnswer: 1, isCorrect: true }),
    )

    await sut.execute({ exerciseList: list2 })

    expect(goalProgressRepository.items).toHaveLength(1)
    expect(goalProgressRepository.items[0].totalAnswered).toBe(3)
    expect(goalProgressRepository.items[0].correctCount).toBe(2)
  })

  it('deve mapear corretamente com shuffle via questionSubjectMap', async () => {
    const userId = new UniqueEntityID('user-1')
    const now = new Date()

    const studyPlan = MakeStudyPlan({
      userId,
      startDate: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      endDate: new Date(now.getTime() + 23 * 24 * 60 * 60 * 1000),
      createdAt: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      goals: [
        MakeStudyPlanGoal({ subject: 'Matemática', weeklyQuestionsTarget: 10 }),
        MakeStudyPlanGoal({ subject: 'Português', weeklyQuestionsTarget: 10 }),
      ],
    })
    studyPlansRepository.items.push(studyPlan)

    // Shuffled order: q2(Port), q1(Mat), q3(Port) — but questionSubjectMap preserves the original mapping
    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      shuffleQuestions: true,
      sections: [
        { subject: 'Matemática', quantity: 1 },
        { subject: 'Português', quantity: 2 },
      ],
      questionIds: ['q2', 'q1', 'q3'],
      questionSubjectMap: { q1: 'Matemática', q2: 'Português', q3: 'Português' },
      totalQuestions: 3,
      createdAt: now,
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q2', selectedAnswer: 2, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q3', selectedAnswer: 3, isCorrect: false }),
    )

    await sut.execute({ exerciseList })

    const mathProgress = goalProgressRepository.items.find(
      (p) => p.subject === 'Matemática',
    )
    const portProgress = goalProgressRepository.items.find(
      (p) => p.subject === 'Português',
    )

    expect(mathProgress?.totalAnswered).toBe(1)
    expect(mathProgress?.correctCount).toBe(1)
    expect(portProgress?.totalAnswered).toBe(2)
    expect(portProgress?.correctCount).toBe(1)
  })

  it('deve ignorar questões sem goal correspondente', async () => {
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
    studyPlansRepository.items.push(studyPlan)

    const exerciseList = MakeExerciseList({
      userId,
      status: ExerciseListStatus.FINISHED,
      sections: [{ subject: 'Física', quantity: 2 }],
      questionIds: ['q1', 'q2'],
      questionSubjectMap: { q1: 'Física', q2: 'Física' },
      totalQuestions: 2,
      createdAt: now,
    })

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q1', selectedAnswer: 1, isCorrect: true }),
      ExerciseAnswer.create({ exerciseListId: exerciseList.id, questionId: 'q2', selectedAnswer: 2, isCorrect: true }),
    )

    const result = await sut.execute({ exerciseList })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.updated).toBe(false)
    }
    expect(goalProgressRepository.items).toHaveLength(0)
  })
})
