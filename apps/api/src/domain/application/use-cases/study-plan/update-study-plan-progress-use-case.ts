import { Either, right } from '@/core/either'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { StudyPlanGoalProgressRepository } from '@/domain/application/repositories/study-plan-goal-progress-repository'
import { StudyPlanGoalProgress } from '@/domain/entreprise/entities/study-plan-goal-progress'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'
import { Injectable } from '@nestjs/common'

export interface UpdateStudyPlanProgressUseCaseRequest {
  exerciseList: ExerciseList
}

type UpdateStudyPlanProgressUseCaseResponse = Either<
  never,
  { updated: boolean }
>

@Injectable()
export class UpdateStudyPlanProgressUseCase {
  constructor(
    private studyPlansRepository: StudyPlansRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
    private studyPlanGoalProgressRepository: StudyPlanGoalProgressRepository,
  ) {}

  async execute({
    exerciseList,
  }: UpdateStudyPlanProgressUseCaseRequest): Promise<UpdateStudyPlanProgressUseCaseResponse> {
    const userId = exerciseList.userId.toValue()
    const studyPlan = await this.studyPlansRepository.findActiveByUserId(userId)

    if (!studyPlan) {
      return right({ updated: false })
    }

    if (exerciseList.createdAt < studyPlan.createdAt) {
      return right({ updated: false })
    }

    if (exerciseList.createdAt > studyPlan.endDate) {
      return right({ updated: false })
    }

    const answers = await this.exerciseAnswersRepository.findManyByListId(
      exerciseList.id.toString(),
    )

    const subjectDeltas = new Map<
      string,
      { answered: number; correct: number }
    >()

    for (const answer of answers) {
      const subject = exerciseList.questionSubjectMap[answer.questionId]
      if (!subject) continue

      const goalMatch = studyPlan.goals.find((g) => g.subject === subject)
      if (!goalMatch) continue

      const delta = subjectDeltas.get(subject) ?? { answered: 0, correct: 0 }
      delta.answered++
      if (answer.isCorrect) delta.correct++
      subjectDeltas.set(subject, delta)
    }

    for (const [subject, delta] of subjectDeltas) {
      const goal = studyPlan.goals.find((g) => g.subject === subject)!
      const existing =
        await this.studyPlanGoalProgressRepository.findByStudyPlanAndSubject(
          studyPlan.id.toString(),
          subject,
        )

      if (existing) {
        existing.totalAnswered = existing.totalAnswered + delta.answered
        existing.correctCount = existing.correctCount + delta.correct
        await this.studyPlanGoalProgressRepository.createOrUpdate(existing)
      } else {
        const progress = StudyPlanGoalProgress.create({
          studyPlanId: studyPlan.id,
          goalId: goal.id,
          subject,
          totalAnswered: delta.answered,
          correctCount: delta.correct,
        })
        await this.studyPlanGoalProgressRepository.createOrUpdate(progress)
      }
    }

    return right({ updated: subjectDeltas.size > 0 })
  }
}
