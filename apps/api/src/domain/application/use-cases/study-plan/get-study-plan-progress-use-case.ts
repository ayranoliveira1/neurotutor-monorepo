import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { StudyPlanGoalProgressRepository } from '@/domain/application/repositories/study-plan-goal-progress-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { StudyPlan, StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'
import { Injectable } from '@nestjs/common'

export interface GetStudyPlanProgressUseCaseRequest {
  userId: string
  studyPlanId: string
}

export interface GoalProgress {
  goalId: string
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent: number | null
  currentWeekAnswered: number
  totalAnswered: number
  correctCount: number
  accuracyPercent: number
  weeklyProgress: number
}

export interface OverallProgress {
  totalQuestions: number
  totalCorrect: number
  avgAccuracy: number
  daysRemaining: number
  daysElapsed: number
  totalDays: number
}

export interface StudyPlanProgressData {
  studyPlan: StudyPlan
  goalsProgress: GoalProgress[]
  overall: OverallProgress
}

type GetStudyPlanProgressUseCaseResponse = Either<
  | ResourceNotFoundError<GetStudyPlanProgressUseCaseRequest>
  | NotAllowedError<GetStudyPlanProgressUseCaseRequest>,
  StudyPlanProgressData
>

@Injectable()
export class GetStudyPlanProgressUseCase {
  constructor(
    private studyPlansRepository: StudyPlansRepository,
    private studyPlanGoalProgressRepository: StudyPlanGoalProgressRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
  ) {}

  async execute({
    userId,
    studyPlanId,
  }: GetStudyPlanProgressUseCaseRequest): Promise<GetStudyPlanProgressUseCaseResponse> {
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

    const now = new Date()
    if (studyPlan.status === StudyPlanStatus.ACTIVE && studyPlan.endDate < now) {
      studyPlan.status = StudyPlanStatus.COMPLETED
      await this.studyPlansRepository.save(studyPlan)
    }

    const progressItems =
      await this.studyPlanGoalProgressRepository.findByStudyPlanId(studyPlanId)

    const progressBySubject = new Map(
      progressItems.map((p) => [p.subject, p]),
    )

    const subjects = studyPlan.goals.map((g) => g.subject)
    const weekStart = getMonday(now)
    const weekEnd = getSunday(now)

    const weeklyAnswers =
      await this.exerciseAnswersRepository.countByUserAndSubjectsInDateRange(
        userId,
        subjects,
        weekStart,
        weekEnd,
      )

    const goalsProgress: GoalProgress[] = studyPlan.goals.map((goal) => {
      const progress = progressBySubject.get(goal.subject)
      const totalAnswered = progress?.totalAnswered ?? 0
      const correctCount = progress?.correctCount ?? 0
      const currentWeekAnswered = weeklyAnswers.get(goal.subject) ?? 0

      const accuracyPercent =
        totalAnswered > 0
          ? Math.round((correctCount / totalAnswered) * 100)
          : 0
      const weeklyProgress =
        goal.weeklyQuestionsTarget > 0
          ? Math.round(
              (currentWeekAnswered / goal.weeklyQuestionsTarget) * 100,
            )
          : 0

      return {
        goalId: goal.id.toString(),
        subject: goal.subject,
        weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
        targetAccuracyPercent: goal.targetAccuracyPercent,
        currentWeekAnswered,
        totalAnswered,
        correctCount,
        accuracyPercent,
        weeklyProgress: Math.min(weeklyProgress, 100),
      }
    })

    const totalQuestions = goalsProgress.reduce(
      (sum, g) => sum + g.totalAnswered,
      0,
    )
    const totalCorrect = goalsProgress.reduce(
      (sum, g) => sum + g.correctCount,
      0,
    )
    const avgAccuracy =
      totalQuestions > 0
        ? Math.round((totalCorrect / totalQuestions) * 100)
        : 0

    const totalDays = Math.ceil(
      (studyPlan.endDate.getTime() - studyPlan.startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    )
    const daysElapsed = Math.max(
      0,
      Math.ceil(
        (now.getTime() - studyPlan.startDate.getTime()) /
          (1000 * 60 * 60 * 24),
      ),
    )
    const daysRemaining = Math.max(0, totalDays - daysElapsed)

    return right({
      studyPlan,
      goalsProgress,
      overall: {
        totalQuestions,
        totalCorrect,
        avgAccuracy,
        daysRemaining,
        daysElapsed,
        totalDays,
      },
    })
  }
}

function getMonday(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  d.setHours(0, 0, 0, 0)
  return d
}

function getSunday(date: Date): Date {
  const monday = getMonday(date)
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)
  return sunday
}
