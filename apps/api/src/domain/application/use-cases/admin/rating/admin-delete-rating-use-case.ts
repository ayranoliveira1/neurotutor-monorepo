import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { RatingsRepository } from '../../../repositories/ratings-repository'
import { Injectable } from '@nestjs/common'

interface AdminDeleteRatingUseCaseRequest {
  ratingId: string
}

type AdminDeleteRatingUseCaseResponse = Either<
  ResourceNotFoundError<AdminDeleteRatingUseCaseRequest>,
  { message: string }
>

@Injectable()
export class AdminDeleteRatingUseCase {
  constructor(private ratingsRepository: RatingsRepository) {}

  async execute({
    ratingId,
  }: AdminDeleteRatingUseCaseRequest): Promise<AdminDeleteRatingUseCaseResponse> {
    const rating = await this.ratingsRepository.findById(ratingId)

    if (!rating) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Avaliação não encontrada.',
            },
          ],
        }),
      )
    }

    await this.ratingsRepository.delete(ratingId)

    return right({ message: 'Avaliação deletada com sucesso.' })
  }
}
