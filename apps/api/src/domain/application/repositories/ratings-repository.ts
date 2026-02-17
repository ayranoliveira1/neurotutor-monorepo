import { RatingPagination } from '@/core/repositories/rating-pagination'
import { Rating } from '@/domain/entreprise/entities/rating'

export interface FindManyRatingsParams {
  page: number
  perPage: number
}

export abstract class RatingsRepository {
  abstract create(rating: Rating): Promise<void>
  abstract findByUserId(userId: string): Promise<Rating | null>
  abstract findById(id: string): Promise<Rating | null>
  abstract findMany(params: FindManyRatingsParams): Promise<RatingPagination>
  abstract delete(id: string): Promise<void>
}
