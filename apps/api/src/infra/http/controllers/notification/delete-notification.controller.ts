import { DeleteNotificationUseCase } from '@/domain/application/use-cases/notification/delete-notification-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type DeleteNotificationErrors = UseCaseErrorProps<string>['errors']

@Controller('notifications')
export class DeleteNotificationController {
  constructor(
    private deleteNotificationUseCase: DeleteNotificationUseCase,
  ) {}

  @Delete(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<HttpResponse<{ message: string }, DeleteNotificationErrors>> {
    const result = await this.deleteNotificationUseCase.execute({
      notificationId: id,
      userId: user.id,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
