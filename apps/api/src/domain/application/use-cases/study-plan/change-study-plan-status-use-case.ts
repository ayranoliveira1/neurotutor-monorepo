import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan, StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'
import { Injectable } from '@nestjs/common'

export interface ChangeStudyPlanStatusUseCaseRequest {
  userId: string
  studyPlanId: string
  status: StudyPlanStatus
}

type ChangeStudyPlanStatusUseCaseResponse = Either<
  | ResourceNotFoundError<ChangeStudyPlanStatusUseCaseRequest>
  | NotAllowedError<ChangeStudyPlanStatusUseCaseRequest>,
  { studyPlan: StudyPlan }
>

@Injectable()
export class ChangeStudyPlanStatusUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    studyPlanId,
    status,
  }: ChangeStudyPlanStatusUseCaseRequest): Promise<ChangeStudyPlanStatusUseCaseResponse> {
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
            { message: 'Você não tem permissão para alterar este plano.' },
          ],
        }),
      )
    }

    if (studyPlan.status !== StudyPlanStatus.ACTIVE) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message:
                'Apenas planos ativos podem ter o status alterado.',
            },
          ],
        }),
      )
    }

    if (
      status !== StudyPlanStatus.COMPLETED &&
      status !== StudyPlanStatus.ARCHIVED
    ) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message:
                'Status inválido. Apenas "COMPLETED" ou "ARCHIVED" são permitidos.',
            },
          ],
        }),
      )
    }

    studyPlan.status = status

    await this.studyPlansRepository.save(studyPlan)

    return right({ studyPlan })
  }
}
