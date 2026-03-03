import { SaveFocusedStudySessionUseCase } from '@/domain/application/use-cases/focused-study-session/save-focused-study-session-use-case'
import { FocusedStudySessionStatus } from '@/domain/entreprise/entities/focused-study-session'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { FocusedStudySessionPresenter } from '@/infra/http/presenters/focused-study-session-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const SaveFocusedStudySessionSchema = z.object({
  status: z.nativeEnum(FocusedStudySessionStatus),
  pomodoroIntervalMins: z.number().int().min(1).max(120),
  breakDurationMins: z.number().int().min(1).max(60),
  pomodorosCompleted: z.number().int().min(0),
  totalTimeSpentSeconds: z.number().int().min(1),
  startedAt: z.coerce.date(),
  completedAt: z.coerce.date(),
})

type SaveFocusedStudySessionDto = z.infer<typeof SaveFocusedStudySessionSchema>

const saveFocusedStudySessionValidationPipe = new ZodValidationPipe(
  SaveFocusedStudySessionSchema,
)

@Controller('focused-study-sessions')
export class SaveFocusedStudySessionController {
  constructor(
    private saveFocusedStudySessionUseCase: SaveFocusedStudySessionUseCase,
  ) {}

  @Post()
  async handle(
    @Body(saveFocusedStudySessionValidationPipe)
    body: SaveFocusedStudySessionDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.saveFocusedStudySessionUseCase.execute({
      userId: user.id,
      status: body.status,
      pomodoroIntervalMins: body.pomodoroIntervalMins,
      breakDurationMins: body.breakDurationMins,
      pomodorosCompleted: body.pomodorosCompleted,
      totalTimeSpentSeconds: body.totalTimeSpentSeconds,
      startedAt: body.startedAt,
      completedAt: body.completedAt,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { session: FocusedStudySessionPresenter.toHTTP(result.value.session) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
