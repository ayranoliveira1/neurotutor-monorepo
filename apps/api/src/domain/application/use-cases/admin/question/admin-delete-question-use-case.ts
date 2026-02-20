import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { QuestionsProvider } from '@/domain/application/providers/questions-provider'
import { ExerciseListsRepository } from '@/domain/application/repositories/exercise-lists-repository'

interface AdminDeleteQuestionUseCaseRequest {
  questionId: string
}

type AdminDeleteQuestionUseCaseResponse = Either<
  | ResourceNotFoundError<{ questionId: string }>
  | NotAllowedError<{ questionId: string }>,
  { message: string }
>

@Injectable()
export class AdminDeleteQuestionUseCase {
  constructor(
    private questionsProvider: QuestionsProvider,
    private exerciseListsRepository: ExerciseListsRepository,
  ) {}

  async execute(
    request: AdminDeleteQuestionUseCaseRequest,
  ): Promise<AdminDeleteQuestionUseCaseResponse> {
    const question = await this.questionsProvider.getQuestionById(
      request.questionId,
    )

    if (!question) {
      return left(
        new ResourceNotFoundError({
          errors: [{ message: 'Questão não encontrada' }],
        }),
      )
    }

    const isUsed = await this.exerciseListsRepository.existsByQuestionId(
      request.questionId,
    )

    if (isUsed) {
      return left(
        new NotAllowedError({
          statusCode: 403,
          errors: [
            {
              message: 'Questão está vinculada a listas de exercícios',
            },
          ],
        }),
      )
    }

    await this.questionsProvider.deleteQuestion(request.questionId)

    return right({ message: 'Questão excluída com sucesso' })
  }
}
