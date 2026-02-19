import { Either, right } from '@/core/either'
import { ExerciseListPagination } from '@/core/repositories/exercise-list-pagination'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { Injectable } from '@nestjs/common'

export interface FetchExerciseListsUseCaseRequest {
  userId: string
  page: number
  perPage: number
  search?: string
  status?: string
  startDate?: Date
  endDate?: Date
}

type FetchExerciseListsUseCaseResponse = Either<
  never,
  ExerciseListPagination
>

@Injectable()
export class FetchExerciseListsUseCase {
  constructor(private exerciseListsRepository: ExerciseListsRepository) {}

  async execute({
    userId,
    page,
    perPage,
    search,
    status,
    startDate,
    endDate,
  }: FetchExerciseListsUseCaseRequest): Promise<FetchExerciseListsUseCaseResponse> {
    const result = await this.exerciseListsRepository.findManyByUserId({
      userId,
      page,
      perPage,
      search,
      status,
      startDate,
      endDate,
    })

    return right(result)
  }
}
