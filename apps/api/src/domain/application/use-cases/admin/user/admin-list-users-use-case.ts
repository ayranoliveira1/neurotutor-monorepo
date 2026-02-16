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
  }: AdminListUsersUseCaseRequest): Promise<AdminListUsersUseCaseResponse> {
    const result = await this.usersRepository.findMany({
      page,
      perPage,
      search,
      startDate,
      endDate,
    })

    return right(result)
  }
}
