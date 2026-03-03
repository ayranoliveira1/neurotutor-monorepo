import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../repositories/notifications-repository'

interface DeleteNotificationUseCaseRequest {
  notificationId: string
  userId: string
}

type DeleteNotificationUseCaseResponse = Either<
  | ResourceNotFoundError<DeleteNotificationUseCaseRequest>
  | NotAllowedError<DeleteNotificationUseCaseRequest>,
  {
    message: string
  }
>

@Injectable()
export class DeleteNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
    userId,
  }: DeleteNotificationUseCaseRequest): Promise<DeleteNotificationUseCaseResponse> {
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
              message: 'Você não tem permissão para deletar esta notificação',
            },
          ],
        }),
      )
    }

    notification.removeRecipient(userId)

    if (notification.recipientCount === 0) {
      await this.notificationsRepository.delete(notificationId)
    } else {
      await this.notificationsRepository.save(notification)
    }

    return right({ message: 'Notificação deletada com sucesso' })
  }
}
