import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanGoalProgress } from '@/domain/entreprise/entities/study-plan-goal-progress'

export class StudyPlanGoalProgressMapper {
  static toDomain(raw: any): StudyPlanGoalProgress {
    return StudyPlanGoalProgress.create(
      {
        studyPlanId: new UniqueEntityID(raw.studyPlanId),
        goalId: new UniqueEntityID(raw.goalId),
        subject: raw.subject,
        totalAnswered: raw.totalAnswered,
        correctCount: raw.correctCount,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(progress: StudyPlanGoalProgress) {
    return {
      id: progress.id.toValue(),
      studyPlanId: progress.studyPlanId.toValue(),
      goalId: progress.goalId.toValue(),
      subject: progress.subject,
      totalAnswered: progress.totalAnswered,
      correctCount: progress.correctCount,
    }
  }
}
