import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { Injectable } from '@nestjs/common'

export interface DeleteExerciseListUseCaseRequest {
  userId: string
  exerciseListId: string
}

type DeleteExerciseListUseCaseResponse = Either<
  | ResourceNotFoundError<DeleteExerciseListUseCaseRequest>
  | NotAllowedError<DeleteExerciseListUseCaseRequest>,
  null
>

@Injectable()
export class DeleteExerciseListUseCase {
  constructor(private exerciseListsRepository: ExerciseListsRepository) {}

  async execute({
    userId,
    exerciseListId,
  }: DeleteExerciseListUseCaseRequest): Promise<DeleteExerciseListUseCaseResponse> {
    const exerciseList =
      await this.exerciseListsRepository.findById(exerciseListId)

    if (!exerciseList) {
      return left(
        new ResourceNotFoundError({
          errors: [{ message: 'Lista de exercícios não encontrada.' }],
        }),
      )
    }

    if (exerciseList.userId.toValue() !== userId) {
      return left(
        new NotAllowedError({
          statusCode: 403,
          errors: [{ message: 'Você não tem permissão para excluir esta lista.' }],
        }),
      )
    }

    await this.exerciseListsRepository.delete(exerciseListId)

    return right(null)
  }
}
