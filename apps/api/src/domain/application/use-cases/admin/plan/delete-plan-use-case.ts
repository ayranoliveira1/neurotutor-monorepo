import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { PlansRepository } from '../../../repositories/plans-repository'
import { subscriptionsRepository } from '../../../repositories/subscriptions-repository'
import { Injectable } from '@nestjs/common'

interface DeletePlanUseCaseRequest {
  planId: string
}

type DeletePlanUseCaseResponse = Either<
  | ResourceNotFoundError<DeletePlanUseCaseRequest>
  | NotAllowedError<DeletePlanUseCaseRequest>,
  { message: string }
>

@Injectable()
export class DeletePlanUseCase {
  constructor(
    private plansRepository: PlansRepository,
    private subscriptionsRepository: subscriptionsRepository,
  ) {}

  async execute({
    planId,
  }: DeletePlanUseCaseRequest): Promise<DeletePlanUseCaseResponse> {
    const plan = await this.plansRepository.findById(planId)

    if (!plan) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Plano não encontrado.',
            },
          ],
        }),
      )
    }

    const hasSubscriptions =
      await this.subscriptionsRepository.existsByPlanId(planId)

    if (hasSubscriptions) {
      return left(
        new NotAllowedError({
          statusCode: 409,
          errors: [
            {
              message:
                'Plano não pode ser excluído pois está vinculado a assinaturas.',
            },
          ],
        }),
      )
    }

    await this.plansRepository.delete(planId)

    return right({ message: 'Plano deletado com sucesso.' })
  }
}
