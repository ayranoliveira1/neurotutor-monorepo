import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface AdminGetUserByIdUseCaseRequest {
  userId: string
}

type AdminGetUserByIdUseCaseResponse = Either<
  ResourceNotFoundError<AdminGetUserByIdUseCaseRequest>,
  { user: User }
>

@Injectable()
export class AdminGetUserByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: AdminGetUserByIdUseCaseRequest): Promise<AdminGetUserByIdUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Usuário não encontrado.',
            },
          ],
        }),
      )
    }

    return right({ user })
  }
}
