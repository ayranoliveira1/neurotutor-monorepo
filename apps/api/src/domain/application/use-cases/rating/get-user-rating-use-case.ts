import { Either, right } from '@/core/either'
import { Rating } from '@/domain/entreprise/entities/rating'
import { RatingsRepository } from '../../repositories/ratings-repository'
import { Injectable } from '@nestjs/common'

interface GetUserRatingUseCaseRequest {
  userId: string
}

type GetUserRatingUseCaseResponse = Either<
  never,
  { rating: Rating | null }
>

@Injectable()
export class GetUserRatingUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    userId,
  }: GetUserRatingUseCaseRequest): Promise<GetUserRatingUseCaseResponse> {
    const rating = await this.ratingsRepository.findByUserId(userId)

    return right({ rating })
  }
}
