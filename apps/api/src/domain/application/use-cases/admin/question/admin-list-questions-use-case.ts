import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import {
  QuestionsProvider,
  type ListQuestionsParams,
  type QuestionsPagination,
} from '@/domain/application/providers/questions-provider'

type AdminListQuestionsUseCaseResponse = Either<never, QuestionsPagination>

@Injectable()
export class AdminListQuestionsUseCase {
  constructor(private questionsProvider: QuestionsProvider) {}

  async execute(
    params: ListQuestionsParams,
  ): Promise<AdminListQuestionsUseCaseResponse> {
    const result = await this.questionsProvider.listQuestions(params)
    return right(result)
  }
}
