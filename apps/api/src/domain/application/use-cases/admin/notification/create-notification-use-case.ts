import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../../repositories/notifications-repository'
import { NotificationQueueProvider } from '../../../providers/notification-queue-provider'
import { Notification } from '@/domain/entreprise/entities/notification'

interface CreateNotificationUseCaseRequest {
  title: string
  message: string
  sendToAll: boolean
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
    private notificationQueueProvider: NotificationQueueProvider,
  ) {}

  async execute({
    title,
    message,
    sendToAll,
    sendIds,
  }: CreateNotificationUseCaseRequest): Promise<CreateNotificationUseCaseResponse> {
    if (!sendToAll && sendIds.length === 0) {
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
        sendIds: sendToAll
          ? []
          : sendIds.map((userId) => ({
              userId,
              readAt: undefined,
            })),
      },
      createdAt: new Date(),
    })

    await this.notificationsRepository.createWithoutRecipients(notification)

    await this.notificationQueueProvider.enqueueRecipients({
      notificationId: notification.id.toString(),
      sendToAll,
      recipientIds: sendIds,
    })

    return right({ notification })
  }
}
