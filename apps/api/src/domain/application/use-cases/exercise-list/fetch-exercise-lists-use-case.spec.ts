import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { FetchExerciseListsUseCase } from './fetch-exercise-lists-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'

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

  it('deve filtrar listas por nome (busca parcial, case-insensitive)', async () => {
    const userId = new UniqueEntityID('user-1')

    exerciseListsRepository.items.push(
      MakeExerciseList({ userId, name: 'Matemática Básica' }),
      MakeExerciseList({ userId, name: 'Português Avançado' }),
      MakeExerciseList({ userId, name: 'Matemática Avançada' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      search: 'matemática',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(2)
      expect(result.value.totalItems).toBe(2)
    }
  })

  it('deve filtrar listas por status', async () => {
    const userId = new UniqueEntityID('user-1')

    exerciseListsRepository.items.push(
      MakeExerciseList({ userId, status: ExerciseListStatus.PENDING }),
      MakeExerciseList({ userId, status: ExerciseListStatus.IN_PROGRESS }),
      MakeExerciseList({ userId, status: ExerciseListStatus.FINISHED }),
      MakeExerciseList({ userId, status: ExerciseListStatus.FINISHED }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      status: ExerciseListStatus.FINISHED,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(2)
      expect(result.value.totalItems).toBe(2)
    }
  })

  it('deve filtrar listas por período (startDate e endDate)', async () => {
    const userId = new UniqueEntityID('user-1')

    exerciseListsRepository.items.push(
      MakeExerciseList({
        userId,
        createdAt: new Date('2025-01-01'),
      }),
      MakeExerciseList({
        userId,
        createdAt: new Date('2025-06-15'),
      }),
      MakeExerciseList({
        userId,
        createdAt: new Date('2025-12-31'),
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      startDate: new Date('2025-06-01'),
      endDate: new Date('2025-12-31'),
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(2)
      expect(result.value.totalItems).toBe(2)
    }
  })

  it('deve combinar múltiplos filtros (AND logic)', async () => {
    const userId = new UniqueEntityID('user-1')

    exerciseListsRepository.items.push(
      MakeExerciseList({
        userId,
        name: 'Matemática ENEM',
        status: ExerciseListStatus.FINISHED,
      }),
      MakeExerciseList({
        userId,
        name: 'Matemática Vestibular',
        status: ExerciseListStatus.PENDING,
      }),
      MakeExerciseList({
        userId,
        name: 'Português ENEM',
        status: ExerciseListStatus.FINISHED,
      }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      search: 'matemática',
      status: ExerciseListStatus.FINISHED,
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(1)
      expect(result.value.exerciseLists[0].name).toBe('Matemática ENEM')
    }
  })

  it('deve retornar lista vazia quando filtros não correspondem', async () => {
    const userId = new UniqueEntityID('user-1')

    exerciseListsRepository.items.push(
      MakeExerciseList({ userId, name: 'Português' }),
    )

    const result = await sut.execute({
      userId: 'user-1',
      page: 1,
      perPage: 10,
      search: 'física',
    })

    expect(result.isRight()).toBe(true)

    if (result.isRight()) {
      expect(result.value.exerciseLists).toHaveLength(0)
      expect(result.value.totalItems).toBe(0)
    }
  })
})
