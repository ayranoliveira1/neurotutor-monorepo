import { AdminGetUserByIdUseCase } from '@/domain/application/use-cases/admin/user/admin-get-user-by-id-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { Controller, Get, Param } from '@nestjs/common'

type UserData = ReturnType<typeof UserPresenter.toHTTP>
type UserErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/users')
export class AdminGetUserByIdController {
  constructor(private adminGetUserByIdUseCase: AdminGetUserByIdUseCase) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  async handle(
    @Param('id') id: string
  ): Promise<HttpResponse<{ user: UserData }, UserErrors>> {
    const result = await this.adminGetUserByIdUseCase.execute({ userId: id })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { user: UserPresenter.toHTTP(result.value.user) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
