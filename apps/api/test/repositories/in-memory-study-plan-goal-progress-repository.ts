import { StudyPlanGoalProgressRepository } from '@/domain/application/repositories/study-plan-goal-progress-repository'
import { StudyPlanGoalProgress } from '@/domain/entreprise/entities/study-plan-goal-progress'

export class InMemoryStudyPlanGoalProgressRepository
  implements StudyPlanGoalProgressRepository
{
  public items: StudyPlanGoalProgress[] = []

  async findByStudyPlanId(
    studyPlanId: string,
  ): Promise<StudyPlanGoalProgress[]> {
    return this.items.filter(
      (i) => i.studyPlanId.toString() === studyPlanId,
    )
  }

  async findByStudyPlanAndSubject(
    studyPlanId: string,
    subject: string,
  ): Promise<StudyPlanGoalProgress | null> {
    const item = this.items.find(
      (i) =>
        i.studyPlanId.toString() === studyPlanId && i.subject === subject,
    )
    return item ?? null
  }

  async save(progress: StudyPlanGoalProgress): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === progress.id.toString(),
    )

    if (index >= 0) {
      this.items[index] = progress
    }
  }

  async createOrUpdate(progress: StudyPlanGoalProgress): Promise<void> {
    const index = this.items.findIndex(
      (i) =>
        i.studyPlanId.toString() === progress.studyPlanId.toString() &&
        i.subject === progress.subject,
    )

    if (index >= 0) {
      this.items[index] = progress
    } else {
      this.items.push(progress)
    }
  }

  async createMany(items: StudyPlanGoalProgress[]): Promise<void> {
    this.items.push(...items)
  }
}
