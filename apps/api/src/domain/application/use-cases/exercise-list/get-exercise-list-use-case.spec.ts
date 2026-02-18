import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { GetExerciseListUseCase } from './get-exercise-list-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let questionsProvider: FakeQuestionsProvider
let sut: GetExerciseListUseCase

describe('GetExerciseListUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository()
    questionsProvider = new FakeQuestionsProvider()
    sut = new GetExerciseListUseCase(
      exerciseListsRepository,
      exerciseAnswersRepository,
      questionsProvider,
    )
  })

  it('deve retornar a lista com questões e mapa de respostas', async () => {
    const q1 = questionsProvider.addQuestion({ subject: 'Matemática' })
    const q2 = questionsProvider.addQuestion({ subject: 'Português' })

    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: [q1.id, q2.id],
      totalQuestions: 2,
      status: ExerciseListStatus.IN_PROGRESS,
    })

    exerciseListsRepository.items.push(exerciseList)

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({
        exerciseListId: exerciseList.id,
        questionId: q1.id,
        selectedAnswer: 2,
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseList.id).toEqual(exerciseList.id)
      expect(result.value.questions).toHaveLength(2)
      expect(result.value.answeredMap[q1.id]).toBe(2)
      expect(result.value.answeredMap[q2.id]).toBeUndefined()
    }
  })

  it('deve retornar mapa vazio quando nenhuma questão foi respondida', async () => {
    const q1 = questionsProvider.addQuestion({ subject: 'Matemática' })

    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: [q1.id],
      totalQuestions: 1,
      status: ExerciseListStatus.PENDING,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answeredMap).toEqual({})
    }
  })

  it('deve retornar erro se a lista não existir', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: 'non-existent-id',
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(ResourceNotFoundError)
    }
  })

  it('deve retornar erro se o usuário não for o dono da lista', async () => {
    const q1 = questionsProvider.addQuestion({ subject: 'Matemática' })

    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: [q1.id],
      totalQuestions: 1,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'other-user',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isLeft()).toBe(true)

    if (result.isLeft()) {
      expect(result.value).toBeInstanceOf(NotAllowedError)
    }
  })
})
