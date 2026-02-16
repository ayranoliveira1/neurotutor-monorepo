import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { AdminUpdateUserUseCase } from './admin-update-user-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/core/enums/enums'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AdminUpdateUserUseCase

describe('Admin Update User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AdminUpdateUserUseCase(inMemoryUsersRepository)
  })

  it('should update a user name', async () => {
    const user = MakeUser({ name: 'Old Name' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'New Name',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('New Name')
    }
  })

  it('should update a user email', async () => {
    const user = MakeUser({ email: 'old@example.com' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'new@example.com',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.email).toBe('new@example.com')
    }
  })

  it('should update a user role', async () => {
    const user = MakeUser({ role: Role.STUDENT })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      role: Role.TEACHER,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.role).toBe(Role.TEACHER)
    }
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      name: 'New Name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not update email if it is already in use', async () => {
    const user1 = MakeUser({ email: 'user1@example.com' })
    const user2 = MakeUser({ email: 'user2@example.com' })
    await inMemoryUsersRepository.save(user1)
    await inMemoryUsersRepository.save(user2)

    const result = await sut.execute({
      userId: user1.id.toString(),
      email: 'user2@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
