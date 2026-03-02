import { StudyPlan } from '@/domain/entreprise/entities/study-plan'

export interface StudyPlanPagination {
  studyPlans: StudyPlan[]
  totalItems: number
  totalPages: number
  currentPage: number
}
