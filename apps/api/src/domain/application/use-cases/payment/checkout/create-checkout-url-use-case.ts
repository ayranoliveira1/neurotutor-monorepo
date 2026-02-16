import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnexpectedError } from '@/core/errors/errors/unexpected-error'
import { PaymentProvider } from '@/domain/application/providers/payment-provider'
import { CheckoutRepository } from '@/domain/application/repositories/checkout-repository'
import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { Checkout } from '@/domain/entreprise/entities/checkout'
import { Injectable } from '@nestjs/common'

interface CreateCheckoutUrlUseCaseRequest {
  planSlug: string
  userId: string
}

type CreateCheckoutUrlUseCaseResponse = Either<
  | UnexpectedError<CreateCheckoutUrlUseCaseRequest>
  | ResourceNotFoundError<CreateCheckoutUrlUseCaseRequest>,
  { checkoutUrl: string }
>

@Injectable()
export class CreateCheckoutUrlUseCase {
  constructor(
    private paymentProvider: PaymentProvider,
    private subscriptionRepository: subscriptionsRepository,
    private checkoutRepository: CheckoutRepository,
    private userRepository: UsersRepository,
    private plansRepository: PlansRepository
  ) {}

  async execute({
    planSlug,
    userId,
  }: CreateCheckoutUrlUseCaseRequest): Promise<CreateCheckoutUrlUseCaseResponse> {
    const user = await this.userRepository.findById(userId)

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

    const plan = await this.plansRepository.findBySlug(planSlug)

    if (!plan) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Plano não encontrado.',
            },
          ],
        })
      )
    }

    const { checkoutUrl, checkoutSession } =
      await this.paymentProvider.createCheckoutUrl(user, plan)

    if (
      !checkoutUrl ||
      typeof checkoutUrl !== 'string' ||
      !checkoutSession ||
      typeof checkoutSession !== 'string'
    ) {
      return left(
        new UnexpectedError({
          statusCode: 500,
          errors: [
            {
              message: 'Erro ao criar a url de checkout.',
            },
          ],
        })
      )
    }

    const subscription = await this.subscriptionRepository.findByUserId(userId)

    if (subscription) {
      const checkout = Checkout.create({
        planId: plan.id,
        paid: false,
        subscriptionId: subscription.id,
        checkoutSession,
      })
      await this.checkoutRepository.createCheckout(checkout)
    }
    return right({ checkoutUrl })
  }
}
