import { StudyPlanGoalProgress } from '@/domain/entreprise/entities/study-plan-goal-progress'

export abstract class StudyPlanGoalProgressRepository {
  abstract findByStudyPlanId(
    studyPlanId: string,
  ): Promise<StudyPlanGoalProgress[]>
  abstract findByStudyPlanAndSubject(
    studyPlanId: string,
    subject: string,
  ): Promise<StudyPlanGoalProgress | null>
  abstract save(progress: StudyPlanGoalProgress): Promise<void>
  abstract createOrUpdate(progress: StudyPlanGoalProgress): Promise<void>
  abstract createMany(items: StudyPlanGoalProgress[]): Promise<void>
}
