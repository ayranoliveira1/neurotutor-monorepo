import { StudyPlanPagination } from '@/core/repositories/study-plan-pagination'
import { StudyPlan } from '@/domain/entreprise/entities/study-plan'

export interface FindManyStudyPlansParams {
  userId: string
  page: number
  perPage: number
  status?: string
}

export abstract class StudyPlansRepository {
  abstract create(studyPlan: StudyPlan): Promise<void>
  abstract findById(id: string): Promise<StudyPlan | null>
  abstract findActiveByUserId(userId: string): Promise<StudyPlan | null>
  abstract findManyByUserId(
    params: FindManyStudyPlansParams,
  ): Promise<StudyPlanPagination>
  abstract save(studyPlan: StudyPlan): Promise<void>
  abstract delete(id: string): Promise<void>
}
