import { CreateNotificationUseCase } from '@/domain/application/use-cases/admin/notification/create-notification-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { NotificationPresenter } from '@/infra/http/presenters/notification-presenter'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import z from 'zod'

const createNotificationBodySchema = z
  .object({
    title: z.string().min(1).max(200),
    message: z.string().min(1).max(5000),
    sendToAll: z.boolean().optional().default(false),
    sendIds: z.array(z.string().uuid()).optional(),
  })
  .refine((data) => data.sendToAll || (data.sendIds && data.sendIds.length > 0), {
    message: 'sendIds é obrigatório quando sendToAll é false',
    path: ['sendIds'],
  })

type CreateNotificationBody = z.infer<typeof createNotificationBodySchema>

@Controller('admin/notifications')
export class AdminCreateNotificationController {
  constructor(
    private createNotificationUseCase: CreateNotificationUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  @UsePipes(new ZodValidationPipe(createNotificationBodySchema))
  async handle(
    @Body() body: CreateNotificationBody,
  ): Promise<
    HttpResponse<
      { notification: ReturnType<typeof NotificationPresenter.toHTTP> },
      UseCaseErrorProps<string>['errors']
    >
  > {
    const result = await this.createNotificationUseCase.execute({
      title: body.title,
      message: body.message,
      sendToAll: body.sendToAll,
      sendIds: body.sendIds ?? [],
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { notification: NotificationPresenter.toHTTP(result.value.notification) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
