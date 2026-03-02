import { StudyPlan } from '@/domain/entreprise/entities/study-plan'
import { StudyPlanGoal } from '@/domain/entreprise/entities/study-plan-goal'

export class StudyPlanGoalPresenter {
  static toHTTP(goal: StudyPlanGoal) {
    return {
      id: goal.id.toString(),
      subject: goal.subject,
      weeklyQuestionsTarget: goal.weeklyQuestionsTarget,
      targetAccuracyPercent: goal.targetAccuracyPercent,
      createdAt: goal.createdAt,
      updatedAt: goal.updatedAt,
    }
  }
}

export class StudyPlanPresenter {
  static toHTTP(studyPlan: StudyPlan) {
    return {
      id: studyPlan.id.toString(),
      name: studyPlan.name,
      description: studyPlan.description,
      status: studyPlan.status,
      startDate: studyPlan.startDate,
      endDate: studyPlan.endDate,
      goals: studyPlan.goals.map(StudyPlanGoalPresenter.toHTTP),
      createdAt: studyPlan.createdAt,
      updatedAt: studyPlan.updatedAt,
    }
  }
}
