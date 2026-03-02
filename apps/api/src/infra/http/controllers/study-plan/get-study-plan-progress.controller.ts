import { GetStudyPlanProgressUseCase } from '@/domain/application/use-cases/study-plan/get-study-plan-progress-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('study-plans')
export class GetStudyPlanProgressController {
  constructor(
    private getStudyPlanProgressUseCase: GetStudyPlanProgressUseCase,
  ) {}

  @Get(':id/progress')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.getStudyPlanProgressUseCase.execute({
      userId: user.id,
      studyPlanId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? {
            studyPlan: StudyPlanPresenter.toHTTP(result.value.studyPlan),
            goalsProgress: result.value.goalsProgress,
            overall: result.value.overall,
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
