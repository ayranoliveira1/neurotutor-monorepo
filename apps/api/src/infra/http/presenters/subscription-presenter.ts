import { Subscription } from '@/domain/entreprise/entities/subscription'

export class SubscriptionPresenter {
  static toHTTP(subscription: Subscription) {
    return {
      id: subscription.id.toString(),
      userId: subscription.userId.toString(),
      planId: subscription.planId.toString(),
      planName: subscription.planName,
      externalId: subscription.externalId,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      metadata: JSON.stringify(subscription.metadata),
      active: subscription.active,
      createdAt: subscription.createdAt,
    }
  }
}
