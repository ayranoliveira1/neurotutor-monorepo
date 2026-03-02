import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { Injectable } from '@nestjs/common'

export interface DeleteStudyPlanUseCaseRequest {
  userId: string
  studyPlanId: string
}

type DeleteStudyPlanUseCaseResponse = Either<
  | ResourceNotFoundError<DeleteStudyPlanUseCaseRequest>
  | NotAllowedError<DeleteStudyPlanUseCaseRequest>,
  null
>

@Injectable()
export class DeleteStudyPlanUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    studyPlanId,
  }: DeleteStudyPlanUseCaseRequest): Promise<DeleteStudyPlanUseCaseResponse> {
    const studyPlan = await this.studyPlansRepository.findById(studyPlanId)

    if (!studyPlan) {
      return left(
        new ResourceNotFoundError({
          errors: [{ message: 'Plano de estudo não encontrado.' }],
        }),
      )
    }

    if (studyPlan.userId.toValue() !== userId) {
      return left(
        new NotAllowedError({
          statusCode: 403,
          errors: [
            { message: 'Você não tem permissão para excluir este plano.' },
          ],
        }),
      )
    }

    await this.studyPlansRepository.delete(studyPlanId)

    return right(null)
  }
}
