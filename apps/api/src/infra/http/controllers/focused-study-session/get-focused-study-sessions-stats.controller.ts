import { GetFocusedStudySessionsStatsUseCase } from '@/domain/application/use-cases/focused-study-session/get-focused-study-sessions-stats-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const GetFocusedStudySessionsStatsSchema = z.object({
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
})

type GetFocusedStudySessionsStatsDto = z.infer<
  typeof GetFocusedStudySessionsStatsSchema
>

const getFocusedStudySessionsStatsValidationPipe = new ZodValidationPipe(
  GetFocusedStudySessionsStatsSchema,
)

@Controller('focused-study-sessions')
export class GetFocusedStudySessionsStatsController {
  constructor(
    private getFocusedStudySessionsStatsUseCase: GetFocusedStudySessionsStatsUseCase,
  ) {}

  @Get('stats')
  async handle(
    @Query(getFocusedStudySessionsStatsValidationPipe)
    query: GetFocusedStudySessionsStatsDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.getFocusedStudySessionsStatsUseCase.execute({
      userId: user.id,
      startDate: query.startDate,
      endDate: query.endDate,
    })

    return {
      success: true,
      data: { stats: result.value.stats },
    }
  }
}
