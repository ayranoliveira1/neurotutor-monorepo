import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { BillingCycle, Plan } from '@/domain/entreprise/entities/plan'
import {
  Plan as PrismaPlan,
  BillingCycle as PrismaBillingCycle,
} from '@/infra/generated/prisma'

const cycleToDomain: Record<PrismaBillingCycle, BillingCycle> = {
  [PrismaBillingCycle.WEEKLY]: BillingCycle.WEEKLY,
  [PrismaBillingCycle.MONTHLY]: BillingCycle.MONTHLY,
  [PrismaBillingCycle.YEARLY]: BillingCycle.YEARLY,
}

const cycleToPrisma: Record<BillingCycle, PrismaBillingCycle> = {
  [BillingCycle.WEEKLY]: PrismaBillingCycle.WEEKLY,
  [BillingCycle.MONTHLY]: PrismaBillingCycle.MONTHLY,
  [BillingCycle.YEARLY]: PrismaBillingCycle.YEARLY,
}

export class PlanMapper {
  static toDomain(raw: PrismaPlan): Plan {
    return Plan.create(
      {
        name: raw.name,
        slug: raw.slug,
        priceCents: raw.priceCents,
        description: raw.description ?? undefined,
        cycle: cycleToDomain[raw.cycle],
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
      cycle: cycleToPrisma[plan.cycle],
      active: plan.active,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }
  }
}
