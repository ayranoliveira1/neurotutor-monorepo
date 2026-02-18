import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryExerciseListsRepository } from '@test/repositories/in-memory-exercise-lists-repository'
import { MakeExerciseList } from '@test/factories/make-exercise-list'
import { DeleteExerciseListUseCase } from './delete-exercise-list-use-case'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let exerciseListsRepository: InMemoryExerciseListsRepository
let sut: DeleteExerciseListUseCase

describe('DeleteExerciseListUseCase', () => {
  beforeEach(() => {
    exerciseListsRepository = new InMemoryExerciseListsRepository()
    sut = new DeleteExerciseListUseCase(exerciseListsRepository)
  })

  it('deve deletar uma lista de exercícios', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-1'),
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(exerciseListsRepository.items).toHaveLength(0)
  })

  it('deve retornar erro se a lista não existe', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: 'non-existent',
    })

    expect(result.isLeft()).toBe(true)
  })

  it('deve retornar erro se a lista pertence a outro usuário', async () => {
    const exerciseList = MakeExerciseList({
      userId: new UniqueEntityID('user-2'),
    })

    exerciseListsRepository.items.push(exerciseList)

    const result = await sut.execute({
      userId: 'user-1',
      exerciseListId: exerciseList.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(exerciseListsRepository.items).toHaveLength(1)
  })
})
