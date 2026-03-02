import { StudyPlanPagination } from '@/core/repositories/study-plan-pagination'
import {
  StudyPlansRepository,
  type FindManyStudyPlansParams,
} from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan } from '@/domain/entreprise/entities/study-plan'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'

export class InMemoryStudyPlansRepository implements StudyPlansRepository {
  public items: StudyPlan[] = []

  async create(studyPlan: StudyPlan): Promise<void> {
    this.items.push(studyPlan)
  }

  async findById(id: string): Promise<StudyPlan | null> {
    const item = this.items.find((i) => i.id.toString() === id)
    return item ?? null
  }

  async findActiveByUserId(userId: string): Promise<StudyPlan | null> {
    const item = this.items.find(
      (i) =>
        i.userId.toString() === userId &&
        i.status === StudyPlanStatus.ACTIVE,
    )
    return item ?? null
  }

  async findManyByUserId(
    params: FindManyStudyPlansParams,
  ): Promise<StudyPlanPagination> {
    const { userId, page, perPage, status } = params

    let filtered = this.items.filter(
      (i) => i.userId.toString() === userId,
    )

    if (status) {
      filtered = filtered.filter((i) => i.status === status)
    }

    const totalItems = filtered.length
    const studyPlans = filtered.slice((page - 1) * perPage, page * perPage)

    return {
      studyPlans,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async save(studyPlan: StudyPlan): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === studyPlan.id.toString(),
    )

    if (index >= 0) {
      this.items[index] = studyPlan
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id.toString() !== id)
  }
}
