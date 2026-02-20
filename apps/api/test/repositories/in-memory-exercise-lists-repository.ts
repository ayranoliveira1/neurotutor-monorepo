import { ExerciseListPagination } from '@/core/repositories/exercise-list-pagination'
import {
  ExerciseListsRepository,
  type FindManyExerciseListsParams,
} from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'

export class InMemoryExerciseListsRepository
  implements ExerciseListsRepository
{
  public items: ExerciseList[] = []

  async create(exerciseList: ExerciseList): Promise<void> {
    this.items.push(exerciseList)
  }

  async findById(id: string): Promise<ExerciseList | null> {
    const item = this.items.find((i) => i.id.toString() === id)
    return item ?? null
  }

  async findManyByUserId(
    params: FindManyExerciseListsParams,
  ): Promise<ExerciseListPagination> {
    const { userId, page, perPage, search, status, startDate, endDate } = params

    let filtered = this.items.filter(
      (i) => i.userId.toString() === userId,
    )

    if (search) {
      filtered = filtered.filter((i) =>
        i.name.toLowerCase().includes(search.toLowerCase()),
      )
    }

    if (status) {
      filtered = filtered.filter((i) => i.status === status)
    }

    if (startDate) {
      filtered = filtered.filter((i) => i.createdAt >= startDate)
    }

    if (endDate) {
      filtered = filtered.filter((i) => i.createdAt <= endDate)
    }

    const totalItems = filtered.length
    const exerciseLists = filtered.slice((page - 1) * perPage, page * perPage)

    return {
      exerciseLists,
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async save(exerciseList: ExerciseList): Promise<void> {
    const index = this.items.findIndex(
      (i) => i.id.toString() === exerciseList.id.toString(),
    )

    if (index >= 0) {
      this.items[index] = exerciseList
    }
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((i) => i.id.toString() !== id)
  }

  async existsByQuestionId(questionId: string): Promise<boolean> {
    return this.items.some((list) => list.questionIds.includes(questionId))
  }
}
