import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { Subscription } from '@/domain/entreprise/entities/subscription'

export class InMemorySubscriptionsRepository implements subscriptionsRepository {
  public items: Subscription[] = []

  async create(subscription: Subscription): Promise<void> {
    this.items.push(subscription)
  }

  async update(subscription: Subscription): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === subscription.id.toString()
    )

    if (index >= 0) {
      this.items[index] = subscription
    }
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const subscription = this.items.find(
      (item) => item.userId.toString() === userId
    )
    return subscription ?? null
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = this.items.find((item) => item.id.toString() === id)
    return subscription ?? null
  }

  async findByExternalId(externalId: string): Promise<Subscription | null> {
    const subscription = this.items.find(
      (item) => item.externalId === externalId
    )
    return subscription ?? null
  }

  async existsByPlanId(planId: string): Promise<boolean> {
    return this.items.some((item) => item.planId.toString() === planId)
  }

  async findPlanIdsWithSubscriptions(): Promise<string[]> {
    return [...new Set(this.items.map((item) => item.planId.toString()))]
  }

  async updatePlanNameByPlanId(
    planId: string,
    planName: string,
  ): Promise<void> {
    this.items.forEach((item) => {
      if (item.planId.toString() === planId) {
        item.planName = planName
      }
    })
  }
}
