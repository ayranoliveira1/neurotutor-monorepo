import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/core/enums/enums'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { User } from '@/domain/entreprise/entities/user'
import { UsersRepository } from '../../../repositories/users-repository'
import { subscriptionsRepository } from '../../../repositories/subscriptions-repository'
import { PlansRepository } from '../../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

interface AdminUpdateUserUseCaseRequest {
  userId: string
  name?: string
  email?: string
  role?: Role
  planId?: string
  endDate?: Date
  active?: boolean
}

type AdminUpdateUserUseCaseResponse = Either<
  | ResourceNotFoundError<AdminUpdateUserUseCaseRequest>
  | NotAllowedError<AdminUpdateUserUseCaseRequest>,
  { user: User }
>

@Injectable()
export class AdminUpdateUserUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private subscriptionsRepository: subscriptionsRepository,
    private plansRepository: PlansRepository,
  ) {}

  async execute({
    userId,
    name,
    email,
    role,
    planId,
    endDate,
    active,
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

    const hasSubscriptionChanges =
      planId !== undefined || endDate !== undefined || active !== undefined

    if (hasSubscriptionChanges) {
      const subscription =
        await this.subscriptionsRepository.findByUserId(userId)

      if (!subscription) {
        return left(
          new ResourceNotFoundError({
            errors: [
              {
                message: 'Assinatura não encontrada.',
              },
            ],
          }),
        )
      }

      if (planId && planId !== subscription.planId.toString()) {
        const plan = await this.plansRepository.findById(planId)

        if (!plan) {
          return left(
            new ResourceNotFoundError({
              errors: [
                {
                  message: 'Plano não encontrado.',
                },
              ],
            }),
          )
        }

        subscription.planId = new UniqueEntityID(planId)
        subscription.planName = plan.name
      }

      if (endDate !== undefined) {
        subscription.endDate = endDate
      }

      if (active !== undefined) {
        subscription.active = active
      }

      await this.subscriptionsRepository.update(subscription)
    }

    return right({ user })
  }
}
