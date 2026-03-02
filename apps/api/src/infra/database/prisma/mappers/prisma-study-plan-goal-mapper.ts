import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { StudyPlanGoal } from '@/domain/entreprise/entities/study-plan-goal'

export class StudyPlanGoalMapper {
  static toDomain(raw: any): StudyPlanGoal {
    return StudyPlanGoal.create(
      {
        studyPlanId: new UniqueEntityID(raw.studyPlanId),
        subject: raw.subject,
        weeklyQuestionsTarget: raw.weeklyQuestionsTarget,
        targetAccuracyPercent: raw.targetAccuracyPercent ?? null,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(goal: StudyPlanGoal) {
    return {
      id: goal.id.toValue(),
      studyPlanId: goal.studyPlanId.toValue(),
      subject: goal.subject,
      weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
      targetAccuracyPercent: goal.targetAccuracyPercent,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }
  }
}
