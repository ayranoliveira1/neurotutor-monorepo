import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import {
  QuestionsProvider,
  type QuestionsStats,
} from '@/domain/application/providers/questions-provider'

type GetQuestionsStatsUseCaseResponse = Either<never, { stats: QuestionsStats }>

@Injectable()
export class GetQuestionsStatsUseCase {
  constructor(private questionsProvider: QuestionsProvider) {}

  async execute(): Promise<GetQuestionsStatsUseCaseResponse> {
    const stats = await this.questionsProvider.getStats()
    return right({ stats })
  }
}
