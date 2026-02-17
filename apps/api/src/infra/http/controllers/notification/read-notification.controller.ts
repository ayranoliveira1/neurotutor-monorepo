import { ReadNotificationUseCase } from '@/domain/application/use-cases/notification/read-notification-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Param, Patch } from '@nestjs/common'

type ReadNotificationErrors = UseCaseErrorProps<string>['errors']

@Controller('notifications')
export class ReadNotificationController {
  constructor(
    private readNotificationUseCase: ReadNotificationUseCase,
  ) {}

  @Patch(':id/read')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ): Promise<HttpResponse<{ message: string }, ReadNotificationErrors>> {
    const result = await this.readNotificationUseCase.execute({
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
