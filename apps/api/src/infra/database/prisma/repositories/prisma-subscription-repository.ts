import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { SubscriptionsMapper } from '../mappers/prisma-subscriptions-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaSubscriptionRepository implements subscriptionsRepository {
  constructor(private prisma: PrismaService) {}

  async create(subscription: Subscription): Promise<void> {
    const data = SubscriptionsMapper.toPrisma(subscription)
    await this.prisma.subscription.create({
      data,
    })
  }

  async update(subscription: Subscription): Promise<void> {
    const data = SubscriptionsMapper.toPrisma(subscription)
    await this.prisma.subscription.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async findByUserId(userId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        userId,
      },
    })

    if (!subscription) {
      return null
    }

    return SubscriptionsMapper.toDomain(subscription)
  }

  async findByExternalId(externalId: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        externalId,
      },
    })

    if (!subscription) {
      return null
    }

    return SubscriptionsMapper.toDomain(subscription)
  }

  async findById(id: string): Promise<Subscription | null> {
    const subscription = await this.prisma.subscription.findUnique({
      where: {
        id,
      },
    })

    if (!subscription) {
      return null
    }

    return SubscriptionsMapper.toDomain(subscription)
  }

  async existsByPlanId(planId: string): Promise<boolean> {
    const count = await this.prisma.subscription.count({
      where: { planId },
    })
    return count > 0
  }

  async findPlanIdsWithSubscriptions(): Promise<string[]> {
    const result = await this.prisma.subscription.groupBy({
      by: ['planId'],
    })
    return result.map((r) => r.planId)
  }

  async updatePlanNameByPlanId(
    planId: string,
    planName: string,
  ): Promise<void> {
    await this.prisma.subscription.updateMany({
      where: { planId },
      data: { planName },
    })
  }
}
