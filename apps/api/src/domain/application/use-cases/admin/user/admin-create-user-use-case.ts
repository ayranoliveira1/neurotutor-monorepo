import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/core/enums/enums'
import { User } from '@/domain/entreprise/entities/user'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { UsersRepository } from '../../../repositories/users-repository'
import { PlansRepository } from '../../../repositories/plans-repository'
import { subscriptionsRepository } from '../../../repositories/subscriptions-repository'
import { AuthProvider } from '../../../providers/auth-provider'
import { Injectable } from '@nestjs/common'

interface AdminCreateUserUseCaseRequest {
  name: string
  email: string
  password: string
  planSlug: string
  durationDays: number
  role?: Role
}

type AdminCreateUserUseCaseResponse = Either<
  | ResourceNotFoundError<AdminCreateUserUseCaseRequest>
  | NotAllowedError<AdminCreateUserUseCaseRequest>,
  { user: User }
>

@Injectable()
export class AdminCreateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private plansRepository: PlansRepository,
    private subscriptionsRepository: subscriptionsRepository,
    private authProvider: AuthProvider
  ) {}

  async execute({
    name,
    email,
    password,
    planSlug,
    durationDays,
    role,
  }: AdminCreateUserUseCaseRequest): Promise<AdminCreateUserUseCaseResponse> {
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
        })
      )
    }

    const plan = await this.plansRepository.findBySlug(planSlug)

    if (!plan) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: `Plano "${planSlug}" não encontrado.`,
            },
          ],
        })
      )
    }

    const result = await this.authProvider.signUp(name, email, password)

    if (!result.user) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Erro ao criar o usuário.',
            },
          ],
        })
      )
    }

    if (role) {
      result.user.role = role
      await this.usersRepository.save(result.user)
    }

    const endDate = new Date()
    endDate.setDate(endDate.getDate() + durationDays)

    const subscription = Subscription.create({
      userId: result.user.id,
      planId: plan.id,
      planName: plan.name,
      startDate: new Date(),
      endDate,
      active: true,
    })

    await this.subscriptionsRepository.create(subscription)

    return right({ user: result.user })
  }
}
