import { Subscription } from '@/domain/entreprise/entities/subscription'
import { User } from '@/domain/entreprise/entities/user'

export interface UserWithSubscription {
  user: User
  subscription: Subscription | null
}

export interface UserPagination {
  users: UserWithSubscription[]
  totalItems: number
  totalPages: number
  currentPage: number
  offset: number
}
