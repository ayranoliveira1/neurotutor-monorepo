import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../repositories/users-repository'
import { AuthProvider } from '../../providers/auth-provider'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { subscriptionsRepository } from '../../repositories/subscriptions-repository'
import { PlansRepository } from '../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

interface CreateAccountUseCaseRequest {
  name: string
  email: string
  password: string
}

type CreateAccountUseCaseResponse = Either<
  ResourceNotFoundError<CreateAccountUseCaseRequest>, { user: User }>

@Injectable()
export class CreateAccountUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subscriptionsRepository: subscriptionsRepository,
    private plansRepository: PlansRepository,
    private authProvider: AuthProvider,
  ) {}

  async execute({ name, email, password }: CreateAccountUseCaseRequest): Promise<CreateAccountUseCaseResponse> {
    const existingUser = await this.usersRepository.findByEmail(email)

    if (existingUser) {
      return left(new ResourceNotFoundError({
        errors: [
          {
            message: 'Email ja está em uso.',
            path: ['email'],
            code: 'EMAIL_IN_USE',
          }
        ]
      }))
    }

    const result = await this.authProvider.signUp(name, email, password)

    const freePlan = await this.plansRepository.findBySlug('free')

    if (!freePlan) {
      return left(new ResourceNotFoundError({
        errors: [
          {
            message: 'Plano gratuito não encontrado. Contate o administrador.',
          }
        ]
      }))
    }

    const subscription = Subscription.create({
      userId: result.user!.id,
      planId: freePlan.id,
      planName: freePlan.name,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 dias free
      active: true,
    })

    await this.subscriptionsRepository.create(subscription)

    return right({ user: result.user! })
  }
}
