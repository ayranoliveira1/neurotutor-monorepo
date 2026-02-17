import { Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { NotificationsRepository } from '../../repositories/notifications-repository'
import { Notification } from '@/domain/entreprise/entities/notification'

interface FetchUserNotificationsUseCaseRequest {
  userId: string
}

type FetchUserNotificationsUseCaseResponse = Either<
  never,
  {
    notifications: Notification[]
  }
>

@Injectable()
export class FetchUserNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    userId,
  }: FetchUserNotificationsUseCaseRequest): Promise<FetchUserNotificationsUseCaseResponse> {
    const notifications =
      await this.notificationsRepository.findByUserId(userId)

    return right({ notifications })
  }
}
