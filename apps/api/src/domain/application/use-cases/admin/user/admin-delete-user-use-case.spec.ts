import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { AdminDeleteUserUseCase } from './admin-delete-user-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AdminDeleteUserUseCase

describe('Admin Delete User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AdminDeleteUserUseCase(inMemoryUsersRepository)
  })

  it('should delete a user', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    expect(inMemoryUsersRepository.items).toHaveLength(1)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.message).toBe('Usuário deletado com sucesso.')
    }
    expect(inMemoryUsersRepository.items).toHaveLength(0)
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({ userId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
