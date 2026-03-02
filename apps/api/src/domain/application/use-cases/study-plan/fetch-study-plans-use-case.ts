import { Either, right } from '@/core/either'
import { StudyPlanPagination } from '@/core/repositories/study-plan-pagination'
import { StudyPlansRepository } from '@/domain/application/repositories/study-plans-repository'
import { Injectable } from '@nestjs/common'

export interface FetchStudyPlansUseCaseRequest {
  userId: string
  page: number
  perPage: number
  status?: string
}

type FetchStudyPlansUseCaseResponse = Either<never, StudyPlanPagination>

@Injectable()
export class FetchStudyPlansUseCase {
  constructor(private studyPlansRepository: StudyPlansRepository) {}

  async execute({
    userId,
    page,
    perPage,
    status,
  }: FetchStudyPlansUseCaseRequest): Promise<FetchStudyPlansUseCaseResponse> {
    const result = await this.studyPlansRepository.findManyByUserId({
      userId,
      page,
      perPage,
      status,
    })

    return right(result)
  }
}
