import { ReadAllNotificationsUseCase } from '@/domain/application/use-cases/notification/read-all-notifications-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Patch } from '@nestjs/common'

@Controller('notifications')
export class ReadAllNotificationsController {
  constructor(
    private readAllNotificationsUseCase: ReadAllNotificationsUseCase,
  ) {}

  @Patch('read-all')
  async handle(
    @CurrentUser() user: { id: string },
  ): Promise<HttpResponse<{ message: string }>> {
    const result = await this.readAllNotificationsUseCase.execute({
      userId: user.id,
    })

    return {
      success: true,
      data: { message: result.value.message },
    }
  }
}
