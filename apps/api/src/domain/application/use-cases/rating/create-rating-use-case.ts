import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Rating } from '@/domain/entreprise/entities/rating'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { RatingsRepository } from '../../repositories/ratings-repository'
import { Injectable } from '@nestjs/common'

interface CreateRatingUseCaseRequest {
  userId: string
  rating: number
  description: string
}

type CreateRatingUseCaseResponse = Either<
  NotAllowedError<CreateRatingUseCaseRequest>,
  { rating: Rating }
>

@Injectable()
export class CreateRatingUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    userId,
    rating,
    description,
  }: CreateRatingUseCaseRequest): Promise<CreateRatingUseCaseResponse> {
    const existing = await this.ratingsRepository.findByUserId(userId)

    if (existing) {
      return left(
        new NotAllowedError({
          statusCode: 409,
          errors: [
            {
              message: 'Você já avaliou a plataforma.',
              code: 'ALREADY_RATED',
            },
          ],
        }),
      )
    }

    const newRating = Rating.create({
      userId: new UniqueEntityID(userId),
      rating,
      description,
    })

    await this.ratingsRepository.create(newRating)

    return right({ rating: newRating })
  }
}
