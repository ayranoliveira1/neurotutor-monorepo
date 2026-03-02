import { FetchStudyPlansUseCase } from '@/domain/application/use-cases/study-plan/fetch-study-plans-use-case'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const FetchStudyPlansSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(10),
  status: z.nativeEnum(StudyPlanStatus).optional(),
})

type FetchStudyPlansDto = z.infer<typeof FetchStudyPlansSchema>

const fetchStudyPlansValidationPipe = new ZodValidationPipe(
  FetchStudyPlansSchema,
)

@Controller('study-plans')
export class FetchStudyPlansController {
  constructor(private fetchStudyPlansUseCase: FetchStudyPlansUseCase) {}

  @Get()
  async handle(
    @Query(fetchStudyPlansValidationPipe) query: FetchStudyPlansDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.fetchStudyPlansUseCase.execute({
      userId: user.id,
      page: query.page,
      perPage: query.perPage,
      status: query.status,
    })

    const data = result.value

    return {
      success: true,
      data: {
        studyPlans: data.studyPlans.map(StudyPlanPresenter.toHTTP),
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      },
    }
  }
}
