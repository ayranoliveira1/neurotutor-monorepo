import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/entreprise/entities/notification'
import {
  Notification as PrismaNotification,
  NotificationRecipient as PrismaNotificationRecipient,
} from '@/infra/generated/prisma'

type PrismaNotificationWithRecipients = PrismaNotification & {
  recipients: PrismaNotificationRecipient[]
}

export class PrismaNotificationMapper {
  static toDomain(raw: PrismaNotificationWithRecipients): Notification {
    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        destination: {
          sendIds: raw.recipients.map((r) => ({
            userId: r.userId,
            readAt: r.readAt ?? undefined,
          })),
        },
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id.toString()),
    )
  }

  static toPrismaCreate(notification: Notification) {
    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? new Date(),
      recipients: {
        create: notification.sendIds.map((r) => ({
          userId: r.userId,
          readAt: r.readAt ?? null,
        })),
      },
    }
  }
}
