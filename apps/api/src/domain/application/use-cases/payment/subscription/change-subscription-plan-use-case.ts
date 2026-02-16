import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PaymentProvider } from '@/domain/application/providers/payment-provider'
import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { Injectable } from '@nestjs/common'

interface ChangeSubscriptionRequest {
  userId: string
  planSlug: string
}

type ChangeSubscriptionResponse = Either<
  | ResourceNotFoundError<ChangeSubscriptionRequest>
  | NotAllowedError<ChangeSubscriptionRequest>,
  { subscription: Subscription }
>

@Injectable()
export class ChangeSubscriptionPlanUseCase {
  constructor(
    private paymentProvider: PaymentProvider,
    private subscriptionRepository: subscriptionsRepository,
    private plansRepository: PlansRepository
  ) {}

  async execute({
    userId,
    planSlug,
  }: ChangeSubscriptionRequest): Promise<ChangeSubscriptionResponse> {
    const plan = await this.plansRepository.findBySlug(planSlug)

    if (!plan) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: `Plano ${planSlug} não encontrado.`,
            },
          ],
        })
      )
    }

    const subscription = await this.subscriptionRepository.findByUserId(userId)

    if (!subscription) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: `Assinatura para o usuário ${userId} não encontrada.`,
            },
          ],
        })
      )
    }

    if (subscription.planId.toValue() === plan.id.toValue()) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message: 'Usuário já está no plano selecionado.',
            },
          ],
        })
      )
    }

    const result = await this.paymentProvider.changeSubscriptionPlan(
      subscription.externalId!,
      plan
    )

    if (!result) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message:
                'Falha ao alterar o plano de assinatura. Tente novamente mais tarde.',
            },
          ],
        })
      )
    }

    subscription.planId = plan.id
    subscription.planName = plan.name
    subscription.active = true

    await this.subscriptionRepository.update(subscription)

    return right({ subscription })
  }
}
