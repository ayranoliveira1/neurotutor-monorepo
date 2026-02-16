import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryRatingsRepository } from '@test/repositories/in-memory-ratings-repository'
import { MakeRating } from '@test/factories/make-rating'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CreateRatingUseCase } from './create-rating-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryRatingsRepository: InMemoryRatingsRepository
let sut: CreateRatingUseCase

describe('Create Rating', () => {
  beforeEach(() => {
    inMemoryRatingsRepository = new InMemoryRatingsRepository()
    sut = new CreateRatingUseCase(inMemoryRatingsRepository)
  })

  it('should be able to create a rating', async () => {
    const result = await sut.execute({
      userId: 'user-1',
      rating: 5,
      description: 'Excelente plataforma!',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.rating.rating).toBe(5)
      expect(result.value.rating.description).toBe('Excelente plataforma!')
      expect(result.value.rating.userId.toString()).toBe('user-1')
    }
    expect(inMemoryRatingsRepository.items).toHaveLength(1)
  })

  it('should not allow a user to rate twice', async () => {
    const userId = new UniqueEntityID('user-1')
    const existing = MakeRating({ userId })
    await inMemoryRatingsRepository.create(existing)

    const result = await sut.execute({
      userId: 'user-1',
      rating: 4,
      description: 'Boa plataforma',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
