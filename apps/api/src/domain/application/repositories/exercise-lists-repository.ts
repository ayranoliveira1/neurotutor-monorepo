import { ExerciseListPagination } from '@/core/repositories/exercise-list-pagination'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'

export interface FindManyExerciseListsParams {
  userId: string
  page: number
  perPage: number
  search?: string
  status?: string
  startDate?: Date
  endDate?: Date
}

export abstract class ExerciseListsRepository {
  abstract create(exerciseList: ExerciseList): Promise<void>
  abstract findById(id: string): Promise<ExerciseList | null>
  abstract findManyByUserId(
    params: FindManyExerciseListsParams,
  ): Promise<ExerciseListPagination>
  abstract save(exerciseList: ExerciseList): Promise<void>
  abstract delete(id: string): Promise<void>
  abstract existsByQuestionId(questionId: string): Promise<boolean>
}
