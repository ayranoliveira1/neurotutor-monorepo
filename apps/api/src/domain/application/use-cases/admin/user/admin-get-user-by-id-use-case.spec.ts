import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { AdminGetUserByIdUseCase } from './admin-get-user-by-id-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AdminGetUserByIdUseCase

describe('Admin Get User By Id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AdminGetUserByIdUseCase(inMemoryUsersRepository)
  })

  it('should get a user by id', async () => {
    const user = MakeUser({ name: 'John Doe' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({ userId: user.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('John Doe')
      expect(result.value.user.id.toString()).toBe(user.id.toString())
    }
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({ userId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
