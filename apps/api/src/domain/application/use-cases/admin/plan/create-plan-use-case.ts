import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Plan, BillingCycle } from '@/domain/entreprise/entities/plan'
import { PlansRepository } from '../../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

interface CreatePlanUseCaseRequest {
  name: string
  slug: string
  priceCents: number
  description?: string
  cycle?: BillingCycle
}

type CreatePlanUseCaseResponse = Either<
  NotAllowedError<CreatePlanUseCaseRequest>,
  { plan: Plan }
>

@Injectable()
export class CreatePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    name,
    slug,
    priceCents,
    description,
    cycle,
  }: CreatePlanUseCaseRequest): Promise<CreatePlanUseCaseResponse> {
    const existingPlan = await this.plansRepository.findBySlug(slug)

    if (existingPlan) {
      return left(
        new NotAllowedError({
          statusCode: 409,
          errors: [
            {
              message: 'Slug já está em uso.',
              path: ['slug'],
              code: 'SLUG_IN_USE',
            },
          ],
        })
      )
    }

    const plan = Plan.create({
      name,
      slug,
      priceCents,
      description,
      cycle,
    })

    await this.plansRepository.create(plan)

    return right({ plan })
  }
}
