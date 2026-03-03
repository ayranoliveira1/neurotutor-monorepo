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

    const updated = notifications.filter((notification) =>
      notification.markAsReadForUser(userId),
    )

    if (updated.length > 0) {
      await this.notificationsRepository.saveMany(updated)
    }

    return right({ message: 'Todas as notificações foram lidas' })
  }
}
