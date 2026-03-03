import { Either, right } from '@/core/either'
import {
  FocusedStudySessionsRepository,
  FocusedStudySessionsStats,
} from '@/domain/application/repositories/focused-study-sessions-repository'
import { Injectable } from '@nestjs/common'

export interface GetFocusedStudySessionsStatsUseCaseRequest {
  userId: string
  startDate: Date
  endDate: Date
}

type GetFocusedStudySessionsStatsUseCaseResponse = Either<
  never,
  { stats: FocusedStudySessionsStats }
>

@Injectable()
export class GetFocusedStudySessionsStatsUseCase {
  constructor(
    private focusedStudySessionsRepository: FocusedStudySessionsRepository,
  ) {}

  async execute(
    request: GetFocusedStudySessionsStatsUseCaseRequest,
  ): Promise<GetFocusedStudySessionsStatsUseCaseResponse> {
    const { userId, startDate, endDate } = request

    const stats = await this.focusedStudySessionsRepository.getStatsByUserId({
      userId,
      startDate,
      endDate,
    })

    return right({ stats })
  }
}
