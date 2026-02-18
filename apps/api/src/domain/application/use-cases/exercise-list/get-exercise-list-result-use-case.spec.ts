import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { GetExerciseListResultUseCase } from './get-exercise-list-result-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let questionsProvider: FakeQuestionsProvider
let sut: GetExerciseListResultUseCase

describe('GetExerciseListResultUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository()
    questionsProvider = new FakeQuestionsProvider()
    sut = new GetExerciseListResultUseCase(
      exerciseListsRepository,
      exerciseAnswersRepository,
      questionsProvider,
    )
  })

  it('deve retornar resultado de uma lista finalizada', async () => {
    const q1 = questionsProvider.addQuestion({ subject: 'Matemática' })

    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: [q1.id],
      totalQuestions: 1,
      status: ExerciseListStatus.FINISHED,
      correctCount: 1,
    })

    exerciseListsRepository.items.push(exerciseList)

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({
        exerciseListId: exerciseList.id,
        questionId: q1.id,
        selectedAnswer: 0,
        isCorrect: true,
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.questions).toHaveLength(1)
      expect(result.value.questions[0].correctAnswer).toBeDefined()
      expect(result.value.answers).toHaveLength(1)
    }
  })

  it('deve retornar erro se a lista não foi finalizada', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      status: ExerciseListStatus.IN_PROGRESS,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
