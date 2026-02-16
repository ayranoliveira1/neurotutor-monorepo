import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Plan, BillingCycle } from '@/domain/entreprise/entities/plan'
import { PlansRepository } from '../../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

interface UpdatePlanUseCaseRequest {
  planId: string
  name?: string
  slug?: string
  priceCents?: number
  description?: string
  cycle?: BillingCycle
  active?: boolean
}

type UpdatePlanUseCaseResponse = Either<
  | ResourceNotFoundError<UpdatePlanUseCaseRequest>
  | NotAllowedError<UpdatePlanUseCaseRequest>,
  { plan: Plan }
>

@Injectable()
export class UpdatePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

  async execute({
    planId,
    name,
    slug,
    priceCents,
    description,
    cycle,
    active,
  }: UpdatePlanUseCaseRequest): Promise<UpdatePlanUseCaseResponse> {
    const plan = await this.plansRepository.findById(planId)

    if (!plan) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Plano não encontrado.',
            },
          ],
        })
      )
    }

    if (slug && slug !== plan.slug) {
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
    }

    plan.name = name ?? plan.name
    plan.slug = slug ?? plan.slug
    plan.priceCents = priceCents ?? plan.priceCents
    plan.description = description ?? plan.description
    plan.cycle = cycle ?? plan.cycle
    plan.active = active ?? plan.active

    await this.plansRepository.save(plan)

    return right({ plan })
  }
}
