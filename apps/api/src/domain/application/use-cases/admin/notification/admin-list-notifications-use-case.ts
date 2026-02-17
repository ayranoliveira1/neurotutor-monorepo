import { Either, right } from '@/core/either'
import { NotificationPagination } from '@/core/repositories/notification-pagination'
import { NotificationsRepository } from '../../../repositories/notifications-repository'
import { Injectable } from '@nestjs/common'

interface AdminListNotificationsUseCaseRequest {
  page: number
  perPage: number
}

type AdminListNotificationsUseCaseResponse = Either<
  never,
  NotificationPagination
>

@Injectable()
export class AdminListNotificationsUseCase {
  constructor(private notificationsRepository: NotificationsRepository) {}

  async execute({
    page,
    perPage,
  }: AdminListNotificationsUseCaseRequest): Promise<AdminListNotificationsUseCaseResponse> {
    const result = await this.notificationsRepository.findAll({ page, perPage })

    return right(result)
  }
}
