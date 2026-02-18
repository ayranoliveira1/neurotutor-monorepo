import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { AnswerExerciseQuestionUseCase } from './answer-exercise-question-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'

let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let sut: AnswerExerciseQuestionUseCase

describe('AnswerExerciseQuestionUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository()
    sut = new AnswerExerciseQuestionUseCase(
      exerciseListsRepository,
      exerciseAnswersRepository
    )
  })

  it('deve registrar uma resposta e mudar status para IN_PROGRESS', async () => {
    const questionIds = ['q-1', 'q-2', 'q-3']
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds,
      totalQuestions: 3,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
      questionId: 'q-1',
      selectedAnswer: 2,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.answer.questionId).toBe('q-1')
      expect(result.value.answer.selectedAnswer).toBe(2)
    }

    expect(exerciseListsRepository.items[0].status).toBe(
      ExerciseListStatus.IN_PROGRESS
    )
    expect(exerciseAnswersRepository.items).toHaveLength(1)
  })

  it('deve retornar erro se a lista não pertence ao usuário', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-2'),
      questionIds: ['q-1'],
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
      questionId: 'q-1',
      selectedAnswer: 0,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se a lista já foi finalizada', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: ['q-1'],
      status: ExerciseListStatus.FINISHED,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
      questionId: 'q-1',
      selectedAnswer: 0,
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se a questão não pertence à lista', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: ['q-1'],
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
      questionId: 'q-99',
      selectedAnswer: 0,
    })

    expect(result.isLeft()).toBe(true)
  })
})
