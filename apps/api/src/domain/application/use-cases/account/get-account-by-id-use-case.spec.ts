import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { GetAccountByIdUseCase } from './get-account-by-id-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: GetAccountByIdUseCase

describe('Get Account By Id', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new GetAccountByIdUseCase(inMemoryUsersRepository)
  })

  it('should be able to get user by id', async () => {
    const user = MakeUser({
      name: 'John Doe',
      email: 'john@example.com',
    })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.id.toString()).toBe(user.id.toString())
      expect(result.value.user.name).toBe('John Doe')
      expect(result.value.user.email).toBe('john@example.com')
    }
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
