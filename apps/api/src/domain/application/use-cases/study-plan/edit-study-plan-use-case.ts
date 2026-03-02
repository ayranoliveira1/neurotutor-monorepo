import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan, StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'
import { StudyPlanGoal } from '@/domain/entreprise/entities/study-plan-goal'
import { Injectable } from '@nestjs/common'

export interface EditStudyPlanGoalInput {
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent?: number | null
}

export interface EditStudyPlanUseCaseRequest {
  userId: string
  studyPlanId: string
  name?: string
  description?: string | null
  startDate?: Date
  endDate?: Date
  goals?: EditStudyPlanGoalInput[]
}

type EditStudyPlanUseCaseResponse = Either<
  | ResourceNotFoundError<EditStudyPlanUseCaseRequest>
  | NotAllowedError<EditStudyPlanUseCaseRequest>,
  { studyPlan: StudyPlan }
>

@Injectable()
export class EditStudyPlanUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    studyPlanId,
    name,
    description,
    startDate,
    endDate,
    goals,
  }: EditStudyPlanUseCaseRequest): Promise<EditStudyPlanUseCaseResponse> {
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
            { message: 'Você não tem permissão para editar este plano.' },
          ],
        }),
      )
    }

    if (studyPlan.status !== StudyPlanStatus.ACTIVE) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            { message: 'Apenas planos ativos podem ser editados.' },
          ],
        }),
      )
    }

    if (name !== undefined) studyPlan.name = name
    if (description !== undefined) studyPlan.description = description
    if (startDate !== undefined) studyPlan.startDate = startDate
    if (endDate !== undefined) studyPlan.endDate = endDate

    if (goals !== undefined) {
      studyPlan.goals = goals.map((goal) =>
        StudyPlanGoal.create({
          studyPlanId: studyPlan.id,
          subject: goal.subject,
          weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
          targetAccuracyPercent: goal.targetAccuracyPercent ?? null,
        }),
      )
    }

    await this.studyPlansRepository.save(studyPlan)

    return right({ studyPlan })
  }
}
