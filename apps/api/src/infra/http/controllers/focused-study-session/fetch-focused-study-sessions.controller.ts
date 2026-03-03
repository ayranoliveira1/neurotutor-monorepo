import { FetchFocusedStudySessionsUseCase } from '@/domain/application/use-cases/focused-study-session/fetch-focused-study-sessions-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { FocusedStudySessionPresenter } from '@/infra/http/presenters/focused-study-session-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const FetchFocusedStudySessionsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(10),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

type FetchFocusedStudySessionsDto = z.infer<
  typeof FetchFocusedStudySessionsSchema
>

const fetchFocusedStudySessionsValidationPipe = new ZodValidationPipe(
  FetchFocusedStudySessionsSchema,
)

@Controller('focused-study-sessions')
export class FetchFocusedStudySessionsController {
  constructor(
    private fetchFocusedStudySessionsUseCase: FetchFocusedStudySessionsUseCase,
  ) {}

  @Get()
  async handle(
    @Query(fetchFocusedStudySessionsValidationPipe)
    query: FetchFocusedStudySessionsDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.fetchFocusedStudySessionsUseCase.execute({
      userId: user.id,
      page: query.page,
      perPage: query.perPage,
      startDate: query.startDate,
      endDate: query.endDate,
    })

    const data = result.value

    return {
      success: true,
      data: {
        sessions: data.sessions.map(FocusedStudySessionPresenter.toHTTP),
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      },
    }
  }
}
