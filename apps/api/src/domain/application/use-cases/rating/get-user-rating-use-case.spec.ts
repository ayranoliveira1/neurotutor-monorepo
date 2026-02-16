import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryRatingsRepository } from '@test/repositories/in-memory-ratings-repository'
import { MakeRating } from '@test/factories/make-rating'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { GetUserRatingUseCase } from './get-user-rating-use-case'

let inMemoryRatingsRepository: InMemoryRatingsRepository
let sut: GetUserRatingUseCase

describe('Get User Rating', () => {
  beforeEach(() => {
    inMemoryRatingsRepository = new InMemoryRatingsRepository()
    sut = new GetUserRatingUseCase(inMemoryRatingsRepository)
  })

  it('should return the user rating when it exists', async () => {
    const userId = new UniqueEntityID('user-1')
    const rating = MakeRating({ userId, rating: 4, description: 'Muito bom' })
    await inMemoryRatingsRepository.create(rating)

    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.rating).not.toBeNull()
      expect(result.value.rating?.rating).toBe(4)
      expect(result.value.rating?.description).toBe('Muito bom')
    }
  })

  it('should return null when user has not rated', async () => {
    const result = await sut.execute({ userId: 'user-1' })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.rating).toBeNull()
    }
  })
})
