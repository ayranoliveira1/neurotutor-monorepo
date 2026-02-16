import { Rating } from '@/domain/entreprise/entities/rating'

export class RatingPresenter {
  static toHTTP(rating: Rating) {
    return {
      id: rating.id.toString(),
      userId: rating.userId.toString(),
      rating: rating.rating,
      description: rating.description,
      createdAt: rating.createdAt,
    }
  }

  static toAdminHTTP(
    rating: Rating,
    userName: string,
    userEmail: string,
  ) {
    return {
      ...RatingPresenter.toHTTP(rating),
      userName,
      userEmail,
    }
  }
}
