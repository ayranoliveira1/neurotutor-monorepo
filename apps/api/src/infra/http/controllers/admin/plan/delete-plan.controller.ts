import { DeletePlanUseCase } from '@/domain/application/use-cases/admin/plan/delete-plan-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type DeletePlanErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/plans')
export class DeletePlanController {
  constructor(private deletePlanUseCase: DeletePlanUseCase) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  async handle(
    @Param('id') id: string
  ): Promise<HttpResponse<{ message: string }, DeletePlanErrors>> {
    const result = await this.deletePlanUseCase.execute({ planId: id })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
