import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  StudyPlanGoalProgress,
  StudyPlanGoalProgressProps,
} from '@/domain/entreprise/entities/study-plan-goal-progress'
import { faker } from '@faker-js/faker'

export function MakeStudyPlanGoalProgress(
  override: Partial<StudyPlanGoalProgressProps> = {},
  id?: UniqueEntityID,
) {
  return StudyPlanGoalProgress.create(
    {
      studyPlanId: override.studyPlanId ?? new UniqueEntityID(),
      goalId: override.goalId ?? new UniqueEntityID(),
      subject: override.subject ?? faker.lorem.word(),
      totalAnswered: override.totalAnswered ?? 0,
      correctCount: override.correctCount ?? 0,
      ...override,
    },
    id,
  )
}
