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
    const { userId, page, perPage } = params

    const filtered = this.items.filter(
      (i) => i.userId.toString() === userId,
    )

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
}
