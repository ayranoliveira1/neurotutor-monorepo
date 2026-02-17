import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../repositories/notifications-repository'

interface ReadNotificationUseCaseRequest {
  notificationId: string
  userId: string
}

type ReadNotificationUseCaseResponse = Either<
  | ResourceNotFoundError<ReadNotificationUseCaseRequest>
  | NotAllowedError<ReadNotificationUseCaseRequest>,
  {
    message: string
  }
>

@Injectable()
export class ReadNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    userId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Notificação não encontrada',
            },
          ],
        }),
      )
    }

    if (
      !notification.destination.sendIds
        .map((id) => id.userId)
        .includes(userId)
    ) {
      return left(
        new NotAllowedError({
          statusCode: 403,
          errors: [
            {
              message: 'Você não tem permissão para ler esta notificação',
            },
          ],
        }),
      )
    }

    const sendIdIndex = notification.destination.sendIds.findIndex(
      (id) => id.userId === userId,
    )

    notification.destination.sendIds[sendIdIndex] = {
      userId,
      readAt: new Date(),
    }

    await this.notificationsRepository.save(notification)

    return right({ message: 'Notificação lida com sucesso' })
  }
}
