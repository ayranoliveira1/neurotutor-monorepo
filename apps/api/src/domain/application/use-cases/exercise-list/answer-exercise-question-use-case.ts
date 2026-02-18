import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import {
  ExerciseList,
  ExerciseListStatus,
} from '@/domain/entreprise/entities/exercise-list'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { Injectable } from '@nestjs/common'

export interface AnswerExerciseQuestionUseCaseRequest {
  userId: string
  exerciseListId: string
  questionId: string
  selectedAnswer: number
  timeSpentSeconds?: number
}

type AnswerExerciseQuestionUseCaseResponse = Either<
  | ResourceNotFoundError<AnswerExerciseQuestionUseCaseRequest>
  | NotAllowedError<AnswerExerciseQuestionUseCaseRequest>,
  { answer: ExerciseAnswer }
>

@Injectable()
export class AnswerExerciseQuestionUseCase {
  constructor(
    private exerciseListsRepository: ExerciseListsRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
  ) {}

  async execute({
    userId,
    exerciseListId,
    questionId,
    selectedAnswer,
    timeSpentSeconds,
  }: AnswerExerciseQuestionUseCaseRequest): Promise<AnswerExerciseQuestionUseCaseResponse> {
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

    if (exerciseList.status === ExerciseListStatus.FINISHED) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [{ message: 'Esta lista já foi finalizada.' }],
        }),
      )
    }

    if (!exerciseList.questionIds.includes(questionId)) {
      return left(
        new ResourceNotFoundError({
          errors: [{ message: 'Questão não pertence a esta lista.' }],
        }),
      )
    }

    if (exerciseList.status === ExerciseListStatus.PENDING) {
      exerciseList.status = ExerciseListStatus.IN_PROGRESS
      await this.exerciseListsRepository.save(exerciseList)
    }

    const answer = ExerciseAnswer.create({
      exerciseListId: exerciseList.id,
      questionId,
      selectedAnswer,
      timeSpentSeconds: timeSpentSeconds ?? 0,
    })

    await this.exerciseAnswersRepository.createOrUpdate(answer)

    return right({ answer })
  }
}
