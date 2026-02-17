import { AdminDeleteNotificationUseCase } from '@/domain/application/use-cases/admin/notification/admin-delete-notification-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type DeleteNotificationErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/notifications')
export class AdminDeleteNotificationController {
  constructor(
    private adminDeleteNotificationUseCase: AdminDeleteNotificationUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  async handle(
    @Param('id') id: string,
  ): Promise<HttpResponse<{ message: string }, DeleteNotificationErrors>> {
    const result = await this.adminDeleteNotificationUseCase.execute({
      notificationId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
