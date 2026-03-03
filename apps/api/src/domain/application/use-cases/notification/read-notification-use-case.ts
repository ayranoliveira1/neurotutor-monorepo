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

    if (!notification.isRecipient(userId)) {
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

    const wasMarked = notification.markAsReadForUser(userId)

    if (wasMarked) {
      await this.notificationsRepository.save(notification)
    }

    return right({ message: 'Notificação lida com sucesso' })
  }
}
