import {
  FindManyRatingsParams,
  RatingsRepository,
} from '@/domain/application/repositories/ratings-repository'
import { Rating } from '@/domain/entreprise/entities/rating'
import { RatingPagination } from '@/core/repositories/rating-pagination'
import { RatingMapper } from '../mappers/prisma-rating-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaRatingsRepository implements RatingsRepository {
  constructor(private prisma: PrismaService) {}

  async create(rating: Rating): Promise<void> {
    const data = RatingMapper.toPrisma(rating)
    await this.prisma.rating.create({ data })
  }

  async findByUserId(userId: string): Promise<Rating | null> {
    const rating = await this.prisma.rating.findUnique({ where: { userId } })
    return rating ? RatingMapper.toDomain(rating) : null
  }

  async findById(id: string): Promise<Rating | null> {
    const rating = await this.prisma.rating.findUnique({ where: { id } })
    return rating ? RatingMapper.toDomain(rating) : null
  }

  async findMany({
    page,
    perPage,
  }: FindManyRatingsParams): Promise<RatingPagination> {
    const offset = (page - 1) * perPage

    const [items, totalItems] = await Promise.all([
      this.prisma.rating.findMany({
        skip: offset,
        take: perPage,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, email: true } } },
      }),
      this.prisma.rating.count(),
    ])

    return {
      ratings: items.map((item) => ({
        rating: RatingMapper.toDomain(item),
        userName: item.user.name,
        userEmail: item.user.email,
      })),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.rating.delete({ where: { id } })
  }
}
