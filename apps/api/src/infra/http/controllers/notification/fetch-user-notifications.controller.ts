import { FetchUserNotificationsUseCase } from '@/domain/application/use-cases/notification/fetch-user-notifications-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { NotificationPresenter } from '@/infra/http/presenters/notification-presenter'
import { Controller, Get } from '@nestjs/common'

@Controller('notifications')
export class FetchUserNotificationsController {
  constructor(
    private fetchUserNotificationsUseCase: FetchUserNotificationsUseCase,
  ) {}

  @Get()
  async handle(
    @CurrentUser() user: { id: string },
  ): Promise<
    HttpResponse<{
      notifications: ReturnType<typeof NotificationPresenter.toUserHTTP>[]
    }>
  > {
    const result = await this.fetchUserNotificationsUseCase.execute({
      userId: user.id,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? {
            notifications: result.value.notifications.map((n) =>
              NotificationPresenter.toUserHTTP(n, user.id),
            ),
          }
        : null,
    }
  }
}
