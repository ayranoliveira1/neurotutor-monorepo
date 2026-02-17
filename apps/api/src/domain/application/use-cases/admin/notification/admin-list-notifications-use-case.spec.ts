import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryNotificationsRepository } from '@test/repositories/in-memory-notifications-repository'
import { MakeNotification } from '@test/factories/make-notification'
import { AdminListNotificationsUseCase } from './admin-list-notifications-use-case'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: AdminListNotificationsUseCase

describe('Admin List Notifications', () => {
  beforeEach(() => {
    inMemoryNotificationsRepository = new InMemoryNotificationsRepository()
    sut = new AdminListNotificationsUseCase(inMemoryNotificationsRepository)
  })

  it('should list notifications with pagination', async () => {
    for (let i = 0; i < 15; i++) {
      await inMemoryNotificationsRepository.create(MakeNotification())
    }

    const result = await sut.execute({ page: 1, perPage: 10 })

    expect(result.isRight()).toBe(true)
    expect(result.value.notifications).toHaveLength(10)
    expect(result.value.totalItems).toBe(15)
    expect(result.value.totalPages).toBe(2)
    expect(result.value.currentPage).toBe(1)
  })

  it('should return second page', async () => {
    for (let i = 0; i < 15; i++) {
      await inMemoryNotificationsRepository.create(MakeNotification())
    }

    const result = await sut.execute({ page: 2, perPage: 10 })

    expect(result.isRight()).toBe(true)
    expect(result.value.notifications).toHaveLength(5)
    expect(result.value.currentPage).toBe(2)
  })

  it('should return empty list when no notifications', async () => {
    const result = await sut.execute({ page: 1, perPage: 10 })

    expect(result.isRight()).toBe(true)
    expect(result.value.notifications).toHaveLength(0)
    expect(result.value.totalItems).toBe(0)
  })
})
