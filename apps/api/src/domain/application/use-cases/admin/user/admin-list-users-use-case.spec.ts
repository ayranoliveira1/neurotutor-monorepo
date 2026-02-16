import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { MakeUser } from '@test/factories/make-user'
import { AdminListUsersUseCase } from './admin-list-users-use-case'

let inMemoryUsersRepository: InMemoryUsersRepository
let sut: AdminListUsersUseCase

describe('Admin List Users', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new AdminListUsersUseCase(inMemoryUsersRepository)
  })

  it('should list users with pagination', async () => {
    for (let i = 0; i < 25; i++) {
      await inMemoryUsersRepository.save(MakeUser({ name: `User ${i}` }))
    }

    const result = await sut.execute({ page: 1, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(20)
    expect(result.value.totalItems).toBe(25)
    expect(result.value.totalPages).toBe(2)
    expect(result.value.currentPage).toBe(1)
    expect(result.value.offset).toBe(0)
  })

  it('should return second page', async () => {
    for (let i = 0; i < 25; i++) {
      await inMemoryUsersRepository.save(MakeUser({ name: `User ${i}` }))
    }

    const result = await sut.execute({ page: 2, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(5)
    expect(result.value.totalItems).toBe(25)
    expect(result.value.currentPage).toBe(2)
    expect(result.value.offset).toBe(20)
  })

  it('should search users by name', async () => {
    await inMemoryUsersRepository.save(MakeUser({ name: 'João Silva' }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'Maria Santos' }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'João Oliveira' }))

    const result = await sut.execute({ page: 1, perPage: 20, search: 'João' })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(2)
    expect(result.value.totalItems).toBe(2)
  })

  it('should filter users by creation date range', async () => {
    const jan = new Date('2026-01-15')
    const feb = new Date('2026-02-15')
    const mar = new Date('2026-03-15')

    await inMemoryUsersRepository.save(MakeUser({ name: 'User Jan', createdAt: jan }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'User Feb', createdAt: feb }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'User Mar', createdAt: mar }))

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].name).toBe('User Feb')
  })

  it('should return empty list when no users exist', async () => {
    const result = await sut.execute({ page: 1, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(0)
    expect(result.value.totalItems).toBe(0)
    expect(result.value.totalPages).toBe(0)
  })
})
