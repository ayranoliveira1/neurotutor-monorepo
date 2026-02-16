import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/core/enums/enums'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface AdminUpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  role?: Role
}

type AdminUpdateUserUseCaseResponse = Either<
  | ResourceNotFoundError<AdminUpdateUserUseCaseRequest>
  | NotAllowedError<AdminUpdateUserUseCaseRequest>,
  { user: User }
>

@Injectable()
export class AdminUpdateUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
    name,
    email,
    role,
  }: AdminUpdateUserUseCaseRequest): Promise<AdminUpdateUserUseCaseResponse> {
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

    if (email && email !== user.email) {
      const existingUser = await this.usersRepository.findByEmail(email)

      if (existingUser) {
        return left(
          new NotAllowedError({
            statusCode: 409,
            errors: [
              {
                message: 'Email já está em uso.',
                path: ['email'],
                code: 'EMAIL_IN_USE',
              },
            ],
          }),
        )
      }
    }

    user.name = name ?? user.name
    if (email) user.email = email
    if (role !== undefined) user.role = role

    await this.usersRepository.save(user)

    return right({ user })
  }
}
