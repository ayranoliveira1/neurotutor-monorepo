import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface GetAccountByIdUseCaseRequest {
  userId: string
}

type GetAccountByIdUseCaseResponse = Either<
  ResourceNotFoundError<GetAccountByIdUseCaseRequest>,
  { user: User }
>

@Injectable()
export class GetAccountByIdUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetAccountByIdUseCaseRequest): Promise<GetAccountByIdUseCaseResponse> {
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
