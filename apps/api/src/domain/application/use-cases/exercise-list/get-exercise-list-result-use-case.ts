import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import {
  QuestionsProvider,
  type QuestionWithAnswer,
} from '@/domain/application/providers/questions-provider'
import { ExerciseList, ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { Injectable } from '@nestjs/common'

export interface GetExerciseListResultUseCaseRequest {
  userId: string
  exerciseListId: string
}

interface ExerciseListResult {
  exerciseList: ExerciseList
  questions: QuestionWithAnswer[]
  answers: ExerciseAnswer[]
}

type GetExerciseListResultUseCaseResponse = Either<
  | ResourceNotFoundError<GetExerciseListResultUseCaseRequest>
  | NotAllowedError<GetExerciseListResultUseCaseRequest>,
  ExerciseListResult
>

@Injectable()
export class GetExerciseListResultUseCase {
  constructor(
    private exerciseListsRepository: ExerciseListsRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
    private questionsProvider: QuestionsProvider,
  ) {}

  async execute({
    userId,
    exerciseListId,
  }: GetExerciseListResultUseCaseRequest): Promise<GetExerciseListResultUseCaseResponse> {
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
          errors: [{ message: 'Você não tem permissão para acessar esta lista.' }],
        }),
      )
    }

    if (exerciseList.status !== ExerciseListStatus.FINISHED) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [{ message: 'Esta lista ainda não foi finalizada.' }],
        }),
      )
    }

    const [questions, answers] = await Promise.all([
      this.questionsProvider.findByIds(
        exerciseList.questionIds,
        true,
      ) as Promise<QuestionWithAnswer[]>,
      this.exerciseAnswersRepository.findManyByListId(exerciseListId),
    ])

    return right({ exerciseList, questions, answers })
  }
}
