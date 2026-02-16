import { Either, right } from '@/core/either'
import { RatingPagination } from '@/core/repositories/rating-pagination'
import { RatingsRepository } from '../../../repositories/ratings-repository'
import { Injectable } from '@nestjs/common'

interface AdminListRatingsUseCaseRequest {
  page: number
  perPage: number
}

type AdminListRatingsUseCaseResponse = Either<never, RatingPagination>

@Injectable()
export class AdminListRatingsUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    page,
    perPage,
  }: AdminListRatingsUseCaseRequest): Promise<AdminListRatingsUseCaseResponse> {
    const result = await this.ratingsRepository.findMany({ page, perPage })

    return right(result)
  }
}
