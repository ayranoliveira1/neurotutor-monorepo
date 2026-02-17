import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../repositories/notifications-repository'

interface ReadAllNotificationsUseCaseRequest {
  userId: string
}

type ReadAllNotificationsUseCaseResponse = Either<
  never,
  {
    message: string
  }
>

@Injectable()
export class ReadAllNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    userId,
  }: ReadAllNotificationsUseCaseRequest): Promise<ReadAllNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findByUserId(userId)

    for (const notification of notifications) {
      const sendIdIndex = notification.destination.sendIds.findIndex(
        (id) => id.userId === userId && !id.readAt,
      )

      if (sendIdIndex === -1) continue

      notification.destination.sendIds[sendIdIndex] = {
        userId,
        readAt: new Date(),
      }

      await this.notificationsRepository.save(notification)
    }

    return right({ message: 'Todas as notificações foram lidas' })
  }
}
