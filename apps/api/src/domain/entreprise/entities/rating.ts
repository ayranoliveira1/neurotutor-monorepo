import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface RatingProps {
  userId: UniqueEntityID
  rating: number
  description: string
  createdAt: Date
}

export class Rating extends Entity<RatingProps> {
  get userId() {
    return this.props.userId
  }

  get rating() {
    return this.props.rating
  }

  get description() {
    return this.props.description
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(props: Optional<RatingProps, 'createdAt'>, id?: UniqueEntityID) {
    return new Rating(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
