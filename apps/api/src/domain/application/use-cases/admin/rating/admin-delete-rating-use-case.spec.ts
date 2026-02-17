import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryRatingsRepository } from '@test/repositories/in-memory-ratings-repository'
import { MakeRating } from '@test/factories/make-rating'
import { AdminDeleteRatingUseCase } from './admin-delete-rating-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryRatingsRepository: InMemoryRatingsRepository
let sut: AdminDeleteRatingUseCase

describe('Admin Delete Rating', () => {
  beforeEach(() => {
    inMemoryRatingsRepository = new InMemoryRatingsRepository()
    sut = new AdminDeleteRatingUseCase(inMemoryRatingsRepository)
  })

  it('should delete a rating', async () => {
    const rating = MakeRating()
    await inMemoryRatingsRepository.create(rating)

    expect(inMemoryRatingsRepository.items).toHaveLength(1)

    const result = await sut.execute({ ratingId: rating.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.message).toBe('Avaliação deletada com sucesso.')
    }
    expect(inMemoryRatingsRepository.items).toHaveLength(0)
  })

  it('should return error when rating is not found', async () => {
    const result = await sut.execute({ ratingId: 'non-existent-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
