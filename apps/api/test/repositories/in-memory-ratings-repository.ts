import { RatingPagination } from '@/core/repositories/rating-pagination'
import {
  FindManyRatingsParams,
  RatingsRepository,
} from '@/domain/application/repositories/ratings-repository'
import { Rating } from '@/domain/entreprise/entities/rating'

export class InMemoryRatingsRepository implements RatingsRepository {
  public items: Rating[] = []
  public userNames: Map<string, { name: string; email: string }> = new Map()

  async create(rating: Rating): Promise<void> {
    this.items.push(rating)
  }

  async findByUserId(userId: string): Promise<Rating | null> {
    const rating = this.items.find(
      (item) => item.userId.toString() === userId,
    )
    return rating ?? null
  }

  async findById(id: string): Promise<Rating | null> {
    const rating = this.items.find((item) => item.id.toString() === id)
    return rating ?? null
  }

  async findMany({
    page,
    perPage,
  }: FindManyRatingsParams): Promise<RatingPagination> {
    const sorted = [...this.items].sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
    )

    const totalItems = sorted.length
    const offset = (page - 1) * perPage
    const paged = sorted.slice(offset, offset + perPage)

    return {
      ratings: paged.map((rating) => {
        const userData = this.userNames.get(rating.userId.toString())
        return {
          rating,
          userName: userData?.name ?? '',
          userEmail: userData?.email ?? '',
        }
      }),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }
}
