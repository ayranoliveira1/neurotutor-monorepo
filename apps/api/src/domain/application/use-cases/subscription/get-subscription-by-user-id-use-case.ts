import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { subscriptionsRepository } from '../../repositories/subscriptions-repository'
import { Injectable } from '@nestjs/common'

interface GetSubscriptionByUserIdUseCaseRequest {
  userId: string
}

type GetSubscriptionByUserIdUseCaseResponse = Either<
  ResourceNotFoundError<GetSubscriptionByUserIdUseCaseRequest>,
  { subscription: Subscription }
>

@Injectable()
export class GetSubscriptionByUserIdUseCase {
  constructor(private subscriptionsRepository: subscriptionsRepository) {}

  async execute({
    userId,
  }: GetSubscriptionByUserIdUseCaseRequest): Promise<GetSubscriptionByUserIdUseCaseResponse> {
    const subscription = await this.subscriptionsRepository.findByUserId(userId)

    if (!subscription) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Assinatura não encontrada.',
            },
          ],
        })
      )
    }

    return right({ subscription })
  }
}
