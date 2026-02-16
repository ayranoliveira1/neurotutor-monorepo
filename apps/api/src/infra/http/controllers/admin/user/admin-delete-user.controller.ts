import { AdminDeleteUserUseCase } from '@/domain/application/use-cases/admin/user/admin-delete-user-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type DeleteUserErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/users')
export class AdminDeleteUserController {
  constructor(private adminDeleteUserUseCase: AdminDeleteUserUseCase) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  async handle(
    @Param('id') id: string
  ): Promise<HttpResponse<{ message: string }, DeleteUserErrors>> {
    const result = await this.adminDeleteUserUseCase.execute({ userId: id })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
