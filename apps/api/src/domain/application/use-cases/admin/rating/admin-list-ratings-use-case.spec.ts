import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryRatingsRepository } from '@test/repositories/in-memory-ratings-repository'
import { MakeRating } from '@test/factories/make-rating'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AdminListRatingsUseCase } from './admin-list-ratings-use-case'

let inMemoryRatingsRepository: InMemoryRatingsRepository
let sut: AdminListRatingsUseCase

describe('Admin List Ratings', () => {
  beforeEach(() => {
    inMemoryRatingsRepository = new InMemoryRatingsRepository()
    sut = new AdminListRatingsUseCase(inMemoryRatingsRepository)
  })

  it('should list ratings with pagination', async () => {
    for (let i = 0; i < 5; i++) {
      const userId = new UniqueEntityID(`user-${i}`)
      inMemoryRatingsRepository.userNames.set(`user-${i}`, {
        name: `User ${i}`,
        email: `user${i}@email.com`,
      })
      await inMemoryRatingsRepository.create(MakeRating({ userId }))
    }

    const result = await sut.execute({ page: 1, perPage: 3 })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.ratings).toHaveLength(3)
      expect(result.value.totalItems).toBe(5)
      expect(result.value.totalPages).toBe(2)
      expect(result.value.currentPage).toBe(1)
    }
  })

  it('should return second page', async () => {
    for (let i = 0; i < 5; i++) {
      const userId = new UniqueEntityID(`user-${i}`)
      await inMemoryRatingsRepository.create(MakeRating({ userId }))
    }

    const result = await sut.execute({ page: 2, perPage: 3 })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.ratings).toHaveLength(2)
      expect(result.value.currentPage).toBe(2)
    }
  })

  it('should return empty list when no ratings exist', async () => {
    const result = await sut.execute({ page: 1, perPage: 10 })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.ratings).toHaveLength(0)
      expect(result.value.totalItems).toBe(0)
    }
  })
})
