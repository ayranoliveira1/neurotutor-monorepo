import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'

export interface ExerciseListPagination {
  exerciseLists: ExerciseList[]
  totalItems: number
  totalPages: number
  currentPage: number
}
