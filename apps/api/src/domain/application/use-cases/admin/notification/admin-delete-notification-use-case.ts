import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotificationsRepository } from '../../../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

interface AdminDeleteNotificationUseCaseRequest {
  notificationId: string
}

type AdminDeleteNotificationUseCaseResponse = Either<
  ResourceNotFoundError<AdminDeleteNotificationUseCaseRequest>,
  { message: string }
>

@Injectable()
export class AdminDeleteNotificationUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    notificationId,
  }: AdminDeleteNotificationUseCaseRequest): Promise<AdminDeleteNotificationUseCaseResponse> {
    const notification =
      await this.notificationsRepository.findById(notificationId)

    if (!notification) {
      return left(
        new ResourceNotFoundError({
          errors: [
            {
              message: 'Notificação não encontrada.',
            },
          ],
        }),
      )
    }

    await this.notificationsRepository.delete(notificationId)

    return right({ message: 'Notificação deletada com sucesso.' })
  }
}
