import { Either, right } from '@/core/either'
import { Plan } from '@/domain/entreprise/entities/plan'
import { PlansRepository } from '../../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

type ListPlansUseCaseResponse = Either<never, { plans: Plan[] }>

@Injectable()
export class ListPlansUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute(): Promise<ListPlansUseCaseResponse> {
    const allPlans = await this.plansRepository.findAll()
    const plans = allPlans.filter((plan) => plan.active)

    return right({ plans })
  }
}
