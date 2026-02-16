import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { Prisma } from '@/infra/generated/prisma/edge'

export class SubscriptionsMapper {
  static toDomain(raw: any): Subscription {
    return Subscription.create(
      {
        userId: new UniqueEntityID(raw.userId),
        planId: new UniqueEntityID(raw.planId),
        planName: raw.planName,
        startDate: raw.startDate,
        endDate: raw.endDate,
        active: raw.active,
        externalId: raw.externalId,
        metadata: raw.metadata,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(subscription: Subscription) {
    return {
      id: subscription.id.toValue(),
      userId: subscription.userId.toValue(),
      planId: subscription.planId.toValue(),
      planName: subscription.planName,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      externalId: subscription.externalId,
      active: subscription.active,
      metadata: subscription.metadata as Prisma.InputJsonValue,
      createdAt: subscription.createdAt,
    }
  }
}
