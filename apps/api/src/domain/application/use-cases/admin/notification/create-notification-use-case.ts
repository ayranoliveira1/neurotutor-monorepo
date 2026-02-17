import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../../repositories/notifications-repository'
import { SocketProvider } from '../../../providers/socket-provider'
import { Notification } from '@/domain/entreprise/entities/notification'

interface CreateNotificationUseCaseRequest {
  title: string
  message: string
  sendIds: string[]
}

type CreateNotificationUseCaseResponse = Either<
  NotAllowedError<CreateNotificationUseCaseRequest>,
  {
    notification: Notification
  }
>

@Injectable()
export class CreateNotificationUseCase {
  constructor(
    private notificationsRepository: NotificationsRepository,
    private socketProvider: SocketProvider,
  ) {}

  async execute({
    title,
    message,
    sendIds,
  }: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
    if (sendIds.length === 0) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            {
              message: 'Pelo menos um destinatário deve ser selecionado',
            },
          ],
        }),
      )
    }

    const notification = Notification.create({
      title,
      content: message,
      destination: {
        sendIds: sendIds.map((userId) => ({ userId, readAt: undefined })),
      },
      createdAt: new Date(),
    })

    await this.notificationsRepository.create(notification)

    await this.socketProvider.sendNotification({ notification })

    return right({ notification })
  }
}
