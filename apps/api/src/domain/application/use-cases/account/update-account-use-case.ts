import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../repositories/users-repository'
import { Injectable } from '@nestjs/common'

interface UpdateAccountUseCaseRequest {
  userId: string
  name?: string
  cpfCnpj?: string
  phone?: string
  address?: string
  addressNumber?: string
  postalCode?: string
  province?: string
}

type UpdateAccountUseCaseResponse = Either<
  ResourceNotFoundError<UpdateAccountUseCaseRequest>, { user: User }>

@Injectable()
export class UpdateAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
  ) { }

  async execute({ userId, name, cpfCnpj, phone, address, addressNumber, postalCode, province }: UpdateAccountUseCaseRequest): Promise<UpdateAccountUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new ResourceNotFoundError({
        errors: [
          {
            message: 'Usuário não encontrado.',
          }
        ]
      }))
    }

    user.name = name ?? user.name
    user.cpfCnpj = cpfCnpj ?? user.cpfCnpj
    user.phone = phone ?? user.phone
    user.address = address ?? user.address
    user.addressNumber = addressNumber ?? user.addressNumber
    user.postalCode = postalCode ?? user.postalCode
    user.province = province ?? user.province

    await this.usersRepository.save(user)

    return right({ user })
  }
}