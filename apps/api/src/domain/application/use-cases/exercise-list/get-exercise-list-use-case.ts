import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { QuestionsProvider, type QuestionData } from '@/domain/application/providers/questions-provider'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'
import { Injectable } from '@nestjs/common'

export interface GetExerciseListUseCaseRequest {
  userId: string
  exerciseListId: string
}

interface ExerciseListWithQuestions {
  exerciseList: ExerciseList
  questions: QuestionData[]
  answeredMap: Record<string, number>
  timeMap: Record<string, number>
}

type GetExerciseListUseCaseResponse = Either<
  | ResourceNotFoundError<GetExerciseListUseCaseRequest>
  | NotAllowedError<GetExerciseListUseCaseRequest>,
  ExerciseListWithQuestions
>

@Injectable()
export class GetExerciseListUseCase {
  constructor(
    private exerciseListsRepository: ExerciseListsRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
    private questionsProvider: QuestionsProvider,
  ) {}

  async execute({
    userId,
    exerciseListId,
  }: GetExerciseListUseCaseRequest): Promise<GetExerciseListUseCaseResponse> {
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

    const questions = await this.questionsProvider.findByIds(
      exerciseList.questionIds,
    ) as QuestionData[]

    const answers =
      await this.exerciseAnswersRepository.findManyByListId(exerciseListId)

    const answeredMap: Record<string, number> = {}
    const timeMap: Record<string, number> = {}
    for (const answer of answers) {
      answeredMap[answer.questionId] = answer.selectedAnswer
      timeMap[answer.questionId] = answer.timeSpentSeconds
    }

    return right({ exerciseList, questions, answeredMap, timeMap })
  }
}
