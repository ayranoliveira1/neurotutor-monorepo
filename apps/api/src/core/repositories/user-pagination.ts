import { User } from '@/domain/entreprise/entities/user'

export interface UserPagination {
  users: User[]
  totalItems: number
  totalPages: number
  currentPage: number
  offset: number
}
