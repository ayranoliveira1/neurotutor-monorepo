import { Either, right } from '@/core/either'
import { Plan } from '@/domain/entreprise/entities/plan'
import { PlansRepository } from '../../../repositories/plans-repository'
import { subscriptionsRepository } from '../../../repositories/subscriptions-repository'
import { Injectable } from '@nestjs/common'

export interface AdminPlanItem {
  plan: Plan
  canDelete: boolean
}

type AdminListPlansUseCaseResponse = Either<never, { plans: AdminPlanItem[] }>

@Injectable()
export class AdminListPlansUseCase {
  constructor(
    private plansRepository: PlansRepository,
    private subscriptionsRepository: subscriptionsRepository,
  ) {}

  async execute(): Promise<AdminListPlansUseCaseResponse> {
    const plans = await this.plansRepository.findAll()
    const planIdsWithSubs =
      await this.subscriptionsRepository.findPlanIdsWithSubscriptions()

    const result: AdminPlanItem[] = plans.map((plan) => ({
      plan,
      canDelete: !planIdsWithSubs.includes(plan.id.toString()),
    }))

    return right({ plans: result })
  }
}
