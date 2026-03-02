import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan } from '@/domain/entreprise/entities/study-plan'
import { StudyPlanGoal } from '@/domain/entreprise/entities/study-plan-goal'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface CreateStudyPlanGoalInput {
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent?: number | null
}

export interface CreateStudyPlanUseCaseRequest {
  userId: string
  name: string
  description?: string | null
  startDate: Date
  endDate: Date
  goals: CreateStudyPlanGoalInput[]
}

type CreateStudyPlanUseCaseResponse = Either<
  NotAllowedError<CreateStudyPlanUseCaseRequest>,
  { studyPlan: StudyPlan }
>

@Injectable()
export class CreateStudyPlanUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    name,
    description,
    startDate,
    endDate,
    goals,
  }: CreateStudyPlanUseCaseRequest): Promise<CreateStudyPlanUseCaseResponse> {
    if (endDate <= startDate) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            { message: 'A data de término deve ser posterior à data de início.' },
          ],
        }),
      )
    }

    const subjects = goals.map((g) => g.subject)
    const uniqueSubjects = new Set(subjects)
    if (uniqueSubjects.size !== subjects.length) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            { message: 'Não é permitido ter disciplinas duplicadas nas metas.' },
          ],
        }),
      )
    }

    const existingActive =
      await this.studyPlansRepository.findActiveByUserId(userId)

    if (existingActive) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message:
                'Você já possui um plano de estudo ativo. Arquive ou complete o plano atual antes de criar um novo.',
            },
          ],
        }),
      )
    }

    const studyPlan = StudyPlan.create({
      userId: new UniqueEntityID(userId),
      name,
      description: description ?? null,
      startDate,
      endDate,
    })

    const studyPlanGoals = goals.map((goal) =>
      StudyPlanGoal.create({
        studyPlanId: studyPlan.id,
        subject: goal.subject,
        weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
        targetAccuracyPercent: goal.targetAccuracyPercent ?? null,
      }),
    )

    studyPlan.goals = studyPlanGoals

    await this.studyPlansRepository.create(studyPlan)

    return right({ studyPlan })
  }
}
