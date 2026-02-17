import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rating } from '@/domain/entreprise/entities/rating'
import { Rating as PrismaRating } from '@/infra/generated/prisma'

export class RatingMapper {
  static toDomain(raw: PrismaRating): Rating {
    return Rating.create(
      {
        userId: new UniqueEntityID(raw.userId),
        rating: raw.rating,
        description: raw.description,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(rating: Rating) {
    return {
      id: rating.id.toValue(),
      userId: rating.userId.toValue(),
      rating: rating.rating,
      description: rating.description,
      createdAt: rating.createdAt,
    }
  }
}
