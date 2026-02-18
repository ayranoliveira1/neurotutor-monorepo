import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { FetchExerciseListsUseCase } from './fetch-exercise-lists-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let exerciseListsRepository: InMemoryExerciseListsRepository
let sut: FetchExerciseListsUseCase

describe('FetchExerciseListsUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    sut = new FetchExerciseListsUseCase(exerciseListsRepository)
  })

  it('deve listar as listas de exercícios do usuário com paginação', async () => {
    const userId = new UniqueEntityID('user-1')

    for (let i = 0; i < 15; i++) {
      exerciseListsRepository.items.push(
        MakeExerciseList({ userId }),
      )
    }

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(10)
      expect(result.value.totalItems).toBe(15)
      expect(result.value.totalPages).toBe(2)
      expect(result.value.currentPage).toBe(1)
    }
  })

  it('deve retornar lista vazia se o usuário não tem listas', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(0)
      expect(result.value.totalItems).toBe(0)
    }
  })
})
