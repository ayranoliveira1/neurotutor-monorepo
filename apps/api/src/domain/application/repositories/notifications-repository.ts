import { NotificationPagination } from '@/core/repositories/notification-pagination'
import { Notification } from '@/domain/entreprise/entities/notification'

export abstract class NotificationsRepository {
  abstract create(notification: Notification): Promise<void>
  abstract findById(id: string): Promise<Notification | null>
  abstract findByUserId(userId: string): Promise<Notification[]>
  abstract findAll(params: {
    page: number
    perPage: number
  }): Promise<NotificationPagination>
  abstract delete(id: string): Promise<void>
  abstract save(notification: Notification): Promise<void>
}
