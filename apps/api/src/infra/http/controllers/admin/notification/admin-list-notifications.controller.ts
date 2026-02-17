import { AdminListNotificationsUseCase } from '@/domain/application/use-cases/admin/notification/admin-list-notifications-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { NotificationPresenter } from '@/infra/http/presenters/notification-presenter'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const adminListNotificationsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
})

type AdminListNotificationsQuery = z.infer<
  typeof adminListNotificationsSchema
>

const adminListNotificationsValidationPipe = new ZodValidationPipe(
  adminListNotificationsSchema,
)

@Controller('admin/notifications')
export class AdminListNotificationsController {
  constructor(
    private adminListNotificationsUseCase: AdminListNotificationsUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  async handle(
    @Query(adminListNotificationsValidationPipe)
    query: AdminListNotificationsQuery,
  ): Promise<
    HttpResponse<{
      notifications: ReturnType<typeof NotificationPresenter.toHTTP>[]
      totalItems: number
      totalPages: number
      currentPage: number
    }>
  > {
    const result = await this.adminListNotificationsUseCase.execute(query)

    const pagination = result.value

    return {
      success: true,
      data: {
        notifications: pagination.notifications.map(
          NotificationPresenter.toHTTP,
        ),
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
      },
    }
  }
}
