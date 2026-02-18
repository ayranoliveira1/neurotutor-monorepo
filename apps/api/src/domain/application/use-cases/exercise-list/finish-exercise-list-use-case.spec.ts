import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { FinishExerciseListUseCase } from './finish-exercise-list-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'

let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let questionsProvider: FakeQuestionsProvider
let sut: FinishExerciseListUseCase

describe('FinishExerciseListUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository()
    questionsProvider = new FakeQuestionsProvider()
    sut = new FinishExerciseListUseCase(
      exerciseListsRepository,
      exerciseAnswersRepository,
      questionsProvider,
    )
  })

  it('deve finalizar a lista e calcular acertos', async () => {
    const q1 = questionsProvider.addQuestion({
      subject: 'Matemática',
      correctAnswer: 0,
    })
    const q2 = questionsProvider.addQuestion({
      subject: 'Matemática',
      correctAnswer: 2,
    })
    const q3 = questionsProvider.addQuestion({
      subject: 'Matemática',
      correctAnswer: 1,
    })

    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      questionIds: [q1.id, q2.id, q3.id],
      totalQuestions: 3,
      status: ExerciseListStatus.IN_PROGRESS,
    })

    exerciseListsRepository.items.push(exerciseList)

    exerciseAnswersRepository.items.push(
      ExerciseAnswer.create({
        exerciseListId: exerciseList.id,
        questionId: q1.id,
        selectedAnswer: 0,
      }),
      ExerciseAnswer.create({
        exerciseListId: exerciseList.id,
        questionId: q2.id,
        selectedAnswer: 1,
      }),
      ExerciseAnswer.create({
        exerciseListId: exerciseList.id,
        questionId: q3.id,
        selectedAnswer: 1,
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.correctCount).toBe(2)
      expect(result.value.totalQuestions).toBe(3)
      expect(result.value.exerciseList.status).toBe(
        ExerciseListStatus.FINISHED,
      )
    }
  })

  it('deve retornar erro se a lista já foi finalizada', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
      status: ExerciseListStatus.FINISHED,
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
  })
})
