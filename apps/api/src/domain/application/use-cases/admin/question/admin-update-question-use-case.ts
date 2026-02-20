import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import {
  QuestionsProvider,
  type QuestionWithAnswer,
  type UpdateQuestionParams,
} from '@/domain/application/providers/questions-provider'

interface AdminUpdateQuestionUseCaseRequest extends UpdateQuestionParams {
  questionId: string
}

type AdminUpdateQuestionUseCaseResponse = Either<
  | ResourceNotFoundError<{ questionId: string }>
  | NotAllowedError<AdminUpdateQuestionUseCaseRequest>,
  { question: QuestionWithAnswer }
>

@Injectable()
export class AdminUpdateQuestionUseCase {
  constructor(private questionsProvider: QuestionsProvider) {}

  async execute(
    request: AdminUpdateQuestionUseCaseRequest,
  ): Promise<AdminUpdateQuestionUseCaseResponse> {
    const { questionId, ...params } = request

    const existing = await this.questionsProvider.getQuestionById(questionId)

    if (!existing) {
      return left(
        new ResourceNotFoundError({
          errors: [{ message: 'Questão não encontrada' }],
        }),
      )
    }

    if (
      params.correctAnswer !== undefined &&
      params.alternatives &&
      params.correctAnswer >= params.alternatives.length
    ) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message:
                'A resposta correta deve ser um índice válido das alternativas',
            },
          ],
        }),
      )
    }

    const question = await this.questionsProvider.updateQuestion(
      questionId,
      params,
    )

    return right({ question })
  }
}
