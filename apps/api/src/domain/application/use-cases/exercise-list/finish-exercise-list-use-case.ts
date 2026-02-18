import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { QuestionsProvider } from '@/domain/application/providers/questions-provider'
import { ExerciseList, ExerciseListStatus } from '@/domain/entreprise/entities/exercise-list'
import { Injectable } from '@nestjs/common'

export interface FinishExerciseListUseCaseRequest {
  userId: string
  exerciseListId: string
}

type FinishExerciseListUseCaseResponse = Either<
  | ResourceNotFoundError<FinishExerciseListUseCaseRequest>
  | NotAllowedError<FinishExerciseListUseCaseRequest>,
  { exerciseList: ExerciseList; correctCount: number; totalQuestions: number }
>

@Injectable()
export class FinishExerciseListUseCase {
  constructor(
    private exerciseListsRepository: ExerciseListsRepository,
    private exerciseAnswersRepository: ExerciseAnswersRepository,
    private questionsProvider: QuestionsProvider,
  ) {}

  async execute({
    userId,
    exerciseListId,
  }: FinishExerciseListUseCaseRequest): Promise<FinishExerciseListUseCaseResponse> {
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

    const answers =
      await this.exerciseAnswersRepository.findManyByListId(exerciseListId)

    let correctCount = 0

    for (const answer of answers) {
      const { correctAnswer } = await this.questionsProvider.getAnswer(
        answer.questionId,
      )
      const isCorrect = answer.selectedAnswer === correctAnswer
      answer.isCorrect = isCorrect
      if (isCorrect) correctCount++
    }

    await this.exerciseAnswersRepository.saveManyIsCorrect(answers)

    exerciseList.status = ExerciseListStatus.FINISHED
    exerciseList.correctCount = correctCount
    await this.exerciseListsRepository.save(exerciseList)

    return right({
      exerciseList,
      correctCount,
      totalQuestions: exerciseList.totalQuestions,
    })
  }
}
