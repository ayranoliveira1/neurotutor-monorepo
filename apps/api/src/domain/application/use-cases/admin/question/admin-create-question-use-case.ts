import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import {
  QuestionsProvider,
  type QuestionWithAnswer,
} from '@/domain/application/providers/questions-provider'

interface AdminCreateQuestionUseCaseRequest {
  externalId: string
  statement: string
  imageUrl?: string | null
  alternatives: string[]
  origin: string
  subject: string
  categories: string[]
  correctAnswer: number
  year?: number
  difficulty?: string
}

type AdminCreateQuestionUseCaseResponse = Either<
  NotAllowedError<AdminCreateQuestionUseCaseRequest>,
  { question: QuestionWithAnswer }
>

@Injectable()
export class AdminCreateQuestionUseCase {
  constructor(private questionsProvider: QuestionsProvider) {}

  async execute(
    request: AdminCreateQuestionUseCaseRequest,
  ): Promise<AdminCreateQuestionUseCaseResponse> {
    if (request.correctAnswer >= request.alternatives.length) {
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

    const question = await this.questionsProvider.createQuestion(request)

    return right({ question })
  }
}
