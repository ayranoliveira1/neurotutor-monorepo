import { Subscription } from '@/domain/entreprise/entities/subscription'

export abstract class subscriptionsRepository {
  abstract create(subscription: Subscription): Promise<void>
  abstract update(subscription: Subscription): Promise<void>
  abstract findByUserId(userId: string): Promise<Subscription | null>
  abstract findById(id: string): Promise<Subscription | null>
  abstract findByExternalId(externalId: string): Promise<Subscription | null>
}