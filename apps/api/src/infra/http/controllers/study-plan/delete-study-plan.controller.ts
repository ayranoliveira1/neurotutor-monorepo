import { DeleteStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/delete-study-plan-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { Controller, Delete, Param } from '@nestjs/common'

@Controller('study-plans')
export class DeleteStudyPlanController {
  constructor(private deleteStudyPlanUseCase: DeleteStudyPlanUseCase) {}

  @Delete(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.deleteStudyPlanUseCase.execute({
      userId: user.id,
      studyPlanId: id,
    })

    return {
      success: result.isRight(),
      data: null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
