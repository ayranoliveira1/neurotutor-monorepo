import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan } from '@/domain/entreprise/entities/study-plan'
import { Injectable } from '@nestjs/common'

export interface GetStudyPlanUseCaseRequest {
  userId: string
  studyPlanId: string
}

type GetStudyPlanUseCaseResponse = Either<
  | ResourceNotFoundError<GetStudyPlanUseCaseRequest>
  | NotAllowedError<GetStudyPlanUseCaseRequest>,
  { studyPlan: StudyPlan }
>

@Injectable()
export class GetStudyPlanUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    studyPlanId,
  }: GetStudyPlanUseCaseRequest): Promise<GetStudyPlanUseCaseResponse> {
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
            { message: 'Você não tem permissão para acessar este plano.' },
          ],
        }),
      )
    }

    return right({ studyPlan })
  }
}
