import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { InMemoryExerciseAnswersRepository } from '@test/repositories/in-memory-exercise-answers-repository'
import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { CreateExerciseListUseCase } from './create-exercise-list-use-case'

let exerciseListsRepository: InMemoryExerciseListsRepository
let exerciseAnswersRepository: InMemoryExerciseAnswersRepository
let questionsProvider: FakeQuestionsProvider
let sut: CreateExerciseListUseCase

describe('CreateExerciseListUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    exerciseAnswersRepository = new InMemoryExerciseAnswersRepository(
      exerciseListsRepository,
    )
    questionsProvider = new FakeQuestionsProvider()
    sut = new CreateExerciseListUseCase(
      exerciseListsRepository,
      questionsProvider,
      exerciseAnswersRepository,
    )

    for (let i = 0; i < 10; i++) {
      questionsProvider.addQuestion({ subject: 'Matemática' })
    }

    for (let i = 0; i < 5; i++) {
      questionsProvider.addQuestion({ subject: 'Português' })
    }
  })

  it('deve criar uma lista de exercícios com sucesso', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Minha Lista',
      sections: [
        { subject: 'Matemática', quantity: 3 },
        { subject: 'Português', quantity: 2 },
      ],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseList.name).toBe('Minha Lista')
      expect(result.value.exerciseList.totalQuestions).toBe(5)
      expect(result.value.exerciseList.questionIds).toHaveLength(5)
    }

    expect(exerciseListsRepository.items).toHaveLength(1)
  })

  it('deve embaralhar questões quando shuffleQuestions=true', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Lista Embaralhada',
      shuffleQuestions: true,
      sections: [{ subject: 'Matemática', quantity: 10 }],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseList.shuffleQuestions).toBe(true)
      expect(result.value.exerciseList.questionIds).toHaveLength(10)
    }
  })

  it('deve retornar erro quando não há questões para a disciplina', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Lista Vazia',
      sections: [{ subject: 'Física', quantity: 5 }],
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve ignorar questões já respondidas quando ignoreAnswered=true', async () => {
    const firstResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista 1',
      sections: [{ subject: 'Matemática', quantity: 3 }],
    })

    expect(firstResult.isRight()).toBe(true)

    if (firstResult.isRight()) {
      const firstList = firstResult.value.exerciseList
      for (const qId of firstList.questionIds) {
        exerciseAnswersRepository.items.push(
          ExerciseAnswer.create({
            exerciseListId: firstList.id,
            questionId: qId,
            selectedAnswer: 0,
          }),
        )
      }
    }

    const secondResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista 2',
      ignoreAnswered: true,
      sections: [{ subject: 'Matemática', quantity: 3 }],
    })

    expect(secondResult.isRight()).toBe(true)

    if (secondResult.isRight() && firstResult.isRight()) {
      const firstIds = firstResult.value.exerciseList.questionIds
      const secondIds = secondResult.value.exerciseList.questionIds
      const overlap = secondIds.filter((id) => firstIds.includes(id))
      expect(overlap).toHaveLength(0)
    }
  })

  it('deve retornar erro quando ignoreAnswered=true e todas as questões já foram respondidas', async () => {
    const firstResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista Completa',
      sections: [{ subject: 'Matemática', quantity: 10 }],
    })

    expect(firstResult.isRight()).toBe(true)

    if (firstResult.isRight()) {
      const firstList = firstResult.value.exerciseList
      for (const qId of firstList.questionIds) {
        exerciseAnswersRepository.items.push(
          ExerciseAnswer.create({
            exerciseListId: firstList.id,
            questionId: qId,
            selectedAnswer: 0,
          }),
        )
      }
    }

    const secondResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista Impossível',
      ignoreAnswered: true,
      sections: [{ subject: 'Matemática', quantity: 5 }],
    })

    expect(secondResult.isLeft()).toBe(true)
  })

  it('deve gerar questionSubjectMap correto mesmo com shuffle', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      name: 'Lista Shuffle Map',
      shuffleQuestions: true,
      sections: [
        { subject: 'Matemática', quantity: 3 },
        { subject: 'Português', quantity: 2 },
      ],
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      const { exerciseList } = result.value
      const map = exerciseList.questionSubjectMap

      const mathCount = Object.values(map).filter(
        (s) => s === 'Matemática',
      ).length
      const portCount = Object.values(map).filter(
        (s) => s === 'Português',
      ).length

      expect(mathCount).toBe(3)
      expect(portCount).toBe(2)
      expect(Object.keys(map)).toHaveLength(5)

      // Each questionId should be in the map regardless of shuffle
      for (const qId of exerciseList.questionIds) {
        expect(map[qId]).toBeDefined()
      }
    }
  })

  it('deve permitir questões repetidas quando ignoreAnswered=false', async () => {
    const firstResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista 1',
      sections: [{ subject: 'Matemática', quantity: 10 }],
    })

    expect(firstResult.isRight()).toBe(true)

    if (firstResult.isRight()) {
      const firstList = firstResult.value.exerciseList
      for (const qId of firstList.questionIds) {
        exerciseAnswersRepository.items.push(
          ExerciseAnswer.create({
            exerciseListId: firstList.id,
            questionId: qId,
            selectedAnswer: 0,
          }),
        )
      }
    }

    const secondResult = await sut.execute({
      userId: 'user-1',
      name: 'Lista 2',
      ignoreAnswered: false,
      sections: [{ subject: 'Matemática', quantity: 5 }],
    })

    expect(secondResult.isRight()).toBe(true)
  })
})
