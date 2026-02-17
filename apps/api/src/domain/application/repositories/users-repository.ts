import { UserPagination } from '@/core/repositories/user-pagination'
import { User } from '@/domain/entreprise/entities/user'

export interface FindManyUsersParams {
  page: number
  perPage: number
  search?: string
  startDate?: Date
  endDate?: Date
  role?: string
  active?: boolean
  planId?: string
}

export abstract class UsersRepository {
  abstract save(user: User): Promise<void>
  abstract findByEmail(email: string): Promise<User | null>
  abstract findById(id: string): Promise<User | null>
  abstract findMany(params: FindManyUsersParams): Promise<UserPagination>
  abstract delete(id: string): Promise<void>
  abstract findAllIds(): Promise<string[]>
}
