import { Rating } from '@/domain/entreprise/entities/rating'

export interface RatingWithUser {
  rating: Rating
  userName: string
  userEmail: string
}

export interface RatingPagination {
  ratings: RatingWithUser[]
  totalItems: number
  totalPages: number
  currentPage: number
}
