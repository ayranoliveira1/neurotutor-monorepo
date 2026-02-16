import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Subscription,
  SubscriptionProps,
} from '@/domain/entreprise/entities/subscription'

export function MakeSubscription(
  override: Partial<SubscriptionProps> = {},
  id?: UniqueEntityID
) {
  const subscription = Subscription.create(
    {
      userId: new UniqueEntityID(),
      planId: new UniqueEntityID(),
      planName: 'Free',
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      ...override,
    },
    id
  )
  return subscription
}
