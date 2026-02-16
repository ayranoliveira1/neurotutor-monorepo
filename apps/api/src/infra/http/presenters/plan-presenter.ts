import { Plan } from '@/domain/entreprise/entities/plan'

export class PlanPresenter {
  static toHTTP(plan: Plan) {
    return {
      id: plan.id.toString(),
      name: plan.name,
      slug: plan.slug,
      priceCents: plan.priceCents,
      description: plan.description,
      cycle: plan.cycle,
      active: plan.active,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    }
  }

  static toAdminHTTP(plan: Plan, canDelete: boolean) {
    return {
      ...PlanPresenter.toHTTP(plan),
      canDelete,
    }
  }
}
