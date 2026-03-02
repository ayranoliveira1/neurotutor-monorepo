import { ChangeStudyPlanStatusUseCase } from '@/domain/application/use-cases/study-plan/change-study-plan-status-use-case'
import { StudyPlanStatus } from '@/domain/entreprise/entities/study-plan'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Body, Controller, Param, Patch } from '@nestjs/common'
import z from 'zod'

const ChangeStudyPlanStatusSchema = z.object({
  status: z.nativeEnum(StudyPlanStatus),
})

type ChangeStudyPlanStatusDto = z.infer<typeof ChangeStudyPlanStatusSchema>

const changeStatusValidationPipe = new ZodValidationPipe(
  ChangeStudyPlanStatusSchema,
)

@Controller('study-plans')
export class ChangeStudyPlanStatusController {
  constructor(
    private changeStudyPlanStatusUseCase: ChangeStudyPlanStatusUseCase,
  ) {}

  @Patch(':id/status')
  async handle(
    @Param('id') id: string,
    @Body(changeStatusValidationPipe) body: ChangeStudyPlanStatusDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.changeStudyPlanStatusUseCase.execute({
      userId: user.id,
      studyPlanId: id,
      status: body.status,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { studyPlan: StudyPlanPresenter.toHTTP(result.value.studyPlan) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
