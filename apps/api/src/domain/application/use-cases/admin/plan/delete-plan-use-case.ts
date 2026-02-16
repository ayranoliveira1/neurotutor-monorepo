import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { PlansRepository } from '../../../repositories/plans-repository'
import { Injectable } from '@nestjs/common'

interface DeletePlanUseCaseRequest {
  planId: string
}

type DeletePlanUseCaseResponse = Either<
  ResourceNotFoundError<DeletePlanUseCaseRequest>,
  { message: string }
>

@Injectable()
export class DeletePlanUseCase {
  constructor(private plansRepository: PlansRepository) {}

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
        })
      )
    }

    await this.plansRepository.delete(planId)

    return right({ message: 'Plano deletado com sucesso.' })
  }
}
