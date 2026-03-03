import { Notification } from '@/domain/entreprise/entities/notification'

export class NotificationPresenter {
  static toHTTP(notification: Notification) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      destination: notification.destination,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }
  }

  static toUserHTTP(notification: Notification, userId: string) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      readAt: notification.getRecipientReadAt(userId) ?? null,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt,
    }
  }
}
