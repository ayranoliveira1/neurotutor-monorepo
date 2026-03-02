import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  StudyPlan,
  StudyPlanProps,
} from '@/domain/entreprise/entities/study-plan'
import {
  StudyPlanGoal,
  StudyPlanGoalProps,
} from '@/domain/entreprise/entities/study-plan-goal'
import { faker } from '@faker-js/faker'

export function MakeStudyPlan(
  override: Partial<StudyPlanProps> = {},
  id?: UniqueEntityID,
) {
  const startDate = override.startDate ?? faker.date.recent()
  const endDate =
    override.endDate ?? new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000)

  const plan = StudyPlan.create(
    {
      userId: override.userId ?? new UniqueEntityID(),
      name: override.name ?? faker.lorem.words(3),
      startDate,
      endDate,
      ...override,
    },
    id,
  )

  plan.goals = plan.goals.map((goal) =>
    goal.studyPlanId.equals(plan.id)
      ? goal
      : MakeStudyPlanGoal(
          {
            studyPlanId: plan.id,
            subject: goal.subject,
            weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
            targetAccuracyPercent: goal.targetAccuracyPercent,
          },
          goal.id,
        ),
  )

  return plan
}

export function MakeStudyPlanGoal(
  override: Partial<StudyPlanGoalProps> = {},
  id?: UniqueEntityID,
) {
  return StudyPlanGoal.create(
    {
      studyPlanId: override.studyPlanId ?? new UniqueEntityID(),
      subject: override.subject ?? faker.lorem.word(),
      weeklyQuestionsTarget: override.weeklyQuestionsTarget ?? 10,
      targetAccuracyPercent: override.targetAccuracyPercent ?? null,
      ...override,
    },
    id,
  )
}
