import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Rating, RatingProps } from '@/domain/entreprise/entities/rating'
import { faker } from '@faker-js/faker'

export function MakeRating(
  override: Partial<RatingProps> = {},
  id?: UniqueEntityID,
) {
  return Rating.create(
    {
      userId: new UniqueEntityID(),
      rating: faker.number.int({ min: 1, max: 5 }),
      description: faker.lorem.sentence(),
      ...override,
    },
    id,
  )
}
