import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import {
  QuestionsProvider,
  type QuestionWithAnswer,
} from '@/domain/application/providers/questions-provider'

interface AdminGetQuestionByIdUseCaseRequest {
  questionId: string
}

type AdminGetQuestionByIdUseCaseResponse = Either<
  ResourceNotFoundError<{ questionId: string }>,
  { question: QuestionWithAnswer }
>

@Injectable()
export class AdminGetQuestionByIdUseCase {
  constructor(private questionsProvider: QuestionsProvider) {}

  async execute(
    request: AdminGetQuestionByIdUseCaseRequest,
  ): Promise<AdminGetQuestionByIdUseCaseResponse> {
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

    return right({ question })
  }
}
