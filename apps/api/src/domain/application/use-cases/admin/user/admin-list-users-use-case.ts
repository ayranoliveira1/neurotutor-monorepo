import { Either, right } from '@/core/either'
import { UserPagination } from '@/core/repositories/user-pagination'
import { UsersRepository } from '../../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface AdminListUsersUseCaseRequest {
  page: number
  perPage: number
  search?: string
  startDate?: Date
  endDate?: Date
  role?: string
  active?: boolean
  planId?: string
}

type AdminListUsersUseCaseResponse = Either<never, UserPagination>

@Injectable()
export class AdminListUsersUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    page,
    perPage,
    search,
    startDate,
    endDate,
    role,
    active,
    planId,
  }: AdminListUsersUseCaseRequest): Promise<AdminListUsersUseCaseResponse> {
    const result = await this.usersRepository.findMany({
      page,
      perPage,
      search,
      startDate,
      endDate,
      role,
      active,
      planId,
    })

    return right(result)
  }
}
