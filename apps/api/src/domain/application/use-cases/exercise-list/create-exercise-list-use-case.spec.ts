import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { FakeQuestionsProvider } from '@test/providers/fake-questions-provider'
import { CreateExerciseListUseCase } from './create-exercise-list-use-case'

let exerciseListsRepository: InMemoryExerciseListsRepository
let questionsProvider: FakeQuestionsProvider
let sut: CreateExerciseListUseCase

describe('CreateExerciseListUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    questionsProvider = new FakeQuestionsProvider()
    sut = new CreateExerciseListUseCase(
      exerciseListsRepository,
      questionsProvider,
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
})
