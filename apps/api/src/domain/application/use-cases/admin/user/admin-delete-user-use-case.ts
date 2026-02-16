import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UsersRepository } from '../../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface AdminDeleteUserUseCaseRequest {
  userId: string
}

type AdminDeleteUserUseCaseResponse = Either<
  ResourceNotFoundError<AdminDeleteUserUseCaseRequest>,
  { message: string }
>

@Injectable()
export class AdminDeleteUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: AdminDeleteUserUseCaseRequest): Promise<AdminDeleteUserUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Usuário não encontrado.',
            },
          ],
        })
      )
    }

    await this.usersRepository.delete(userId)

    return right({ message: 'Usuário deletado com sucesso.' })
  }
}
