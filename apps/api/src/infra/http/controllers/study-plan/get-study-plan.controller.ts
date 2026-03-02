import { GetStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/get-study-plan-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('study-plans')
export class GetStudyPlanController {
  constructor(private getStudyPlanUseCase: GetStudyPlanUseCase) {}

  @Get(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.getStudyPlanUseCase.execute({
      userId: user.id,
      studyPlanId: id,
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
