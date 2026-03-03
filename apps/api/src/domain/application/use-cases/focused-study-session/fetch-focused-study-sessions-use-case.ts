import { Either, right } from '@/core/either'
import {
  FocusedStudySessionsRepository,
  FocusedStudySessionsPagination,
} from '@/domain/application/repositories/focused-study-sessions-repository'
import { Injectable } from '@nestjs/common'

export interface FetchFocusedStudySessionsUseCaseRequest {
  userId: string
  page: number
  perPage: number
  startDate?: Date
  endDate?: Date
}

type FetchFocusedStudySessionsUseCaseResponse = Either<
  never,
  FocusedStudySessionsPagination
>

@Injectable()
export class FetchFocusedStudySessionsUseCase {
  constructor(
    private focusedStudySessionsRepository: FocusedStudySessionsRepository,
  ) {}

  async execute(
    request: FetchFocusedStudySessionsUseCaseRequest,
  ): Promise<FetchFocusedStudySessionsUseCaseResponse> {
    const { userId, page, perPage, startDate, endDate } = request

    const result = await this.focusedStudySessionsRepository.findManyByUserId({
      userId,
      page,
      perPage,
      startDate,
      endDate,
    })

    return right(result)
  }
}
