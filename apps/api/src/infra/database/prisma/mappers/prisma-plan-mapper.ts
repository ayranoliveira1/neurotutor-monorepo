import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BillingCycle, Plan } from '@/domain/entreprise/entities/plan'
import {
  Plan as PrismaPlan,
  BillingCycle as PrismaBillingCycle,
} from '@/infra/generated/prisma'

export class PlanMapper {
  static toDomain(raw: PrismaPlan): Plan {
    return Plan.create(
      {
        name: raw.name,
        slug: raw.slug,
        priceCents: raw.priceCents,
        description: raw.description ?? undefined,
        cycle: this.cycleToDomain(raw.cycle),
        active: raw.active,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(plan: Plan) {
    return {
      id: plan.id.toValue(),
      name: plan.name,
      slug: plan.slug,
      priceCents: plan.priceCents,
      description: plan.description ?? null,
      cycle: this.cycleToPrisma(plan.cycle),
      active: plan.active,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }
  }

  private static cycleToDomain(cycle: PrismaBillingCycle): BillingCycle {
    switch (cycle) {
      case PrismaBillingCycle.Weekly:
        return BillingCycle.WEEKLY
      case PrismaBillingCycle.Monthly:
        return BillingCycle.MONTHLY
      case PrismaBillingCycle.Yearly:
        return BillingCycle.YEARLY
      default:
        throw new Error(`Invalid prisma billing cycle: ${cycle}`)
    }
  }

  private static cycleToPrisma(cycle: BillingCycle): PrismaBillingCycle {
    switch (cycle) {
      case BillingCycle.WEEKLY:
        return PrismaBillingCycle.Weekly
      case BillingCycle.MONTHLY:
        return PrismaBillingCycle.Monthly
      case BillingCycle.YEARLY:
        return PrismaBillingCycle.Yearly
      default:
        throw new Error(`Invalid domain billing cycle: ${cycle}`)
    }
  }
}
