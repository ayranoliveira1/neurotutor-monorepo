import { NotificationPagination } from '@/core/repositories/notification-pagination'
import { NotificationsRepository } from '@/domain/application/repositories/notifications-repository'
import { Notification } from '@/domain/entreprise/entities/notification'

export class InMemoryNotificationsRepository
  implements NotificationsRepository
{
  public items: Notification[] = []

  async create(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async createWithoutRecipients(notification: Notification): Promise<void> {
    this.items.push(notification)
  }

  async createManyRecipients(
    notificationId: string,
    recipients: Array<{ userId: string }>,
  ): Promise<void> {
    const notification = this.items.find(
      (n) => n.id.toValue() === notificationId,
    )
    if (!notification) return

    const existing = notification.sendIds.map((r) => r.userId)
    const newRecipients = recipients
      .filter((r) => !existing.includes(r.userId))
      .map((r) => ({ userId: r.userId, readAt: undefined }))

    notification.destination = {
      sendIds: [...notification.sendIds, ...newRecipients],
    }
  }

  async findByIdOnly(id: string): Promise<Notification | null> {
    return this.findById(id)
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = this.items.find((n) => n.id.toValue() === id)
    return notification ?? null
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    return this.items.filter((n) =>
      n.destination.sendIds.some((id) => id.userId === userId),
    )
  }

  async findAll(params: {
    page: number
    perPage: number
  }): Promise<NotificationPagination> {
    const { page, perPage } = params
    const start = (page - 1) * perPage
    const notifications = this.items.slice(start, start + perPage)

    return {
      notifications,
      totalItems: this.items.length,
      totalPages: Math.ceil(this.items.length / perPage),
      currentPage: page,
    }
  }

  async delete(id: string): Promise<void> {
    const index = this.items.findIndex((n) => n.id.toValue() === id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async save(notification: Notification): Promise<void> {
    const index = this.items.findIndex(
      (n) => n.id.toValue() === notification.id.toValue(),
    )
    if (index >= 0) {
      this.items[index] = notification
    }
  }

  async saveMany(notifications: Notification[]): Promise<void> {
    for (const notification of notifications) {
      await this.save(notification)
    }
  }
}
