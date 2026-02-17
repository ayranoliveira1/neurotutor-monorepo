import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification } from '@/domain/entreprise/entities/notification'
import { Notification as PrismaNotification } from '@/infra/generated/prisma'
import { z } from 'zod'

const destinationSchema = z.object({
  sendIds: z.array(
    z.object({
      userId: z.string(),
      readAt: z
        .union([z.date(), z.string().datetime(), z.null()])
        .optional()
        .transform((value) => {
          if (!value) return undefined
          return new Date(value)
        }),
    }),
  ),
})

export class NotificationPrismaMapper {
  static toDomain(raw: PrismaNotification): Notification {
    const destination = raw.destination as unknown
    const validatedDestination = destinationSchema.parse(destination)

    return Notification.create(
      {
        title: raw.title,
        content: raw.content,
        destination: validatedDestination,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id.toString()),
    )
  }

  static toPrisma(notification: Notification): PrismaNotification {
    const validatedDestination = destinationSchema.parse(
      notification.destination,
    )

    const destinationForPrisma = {
      ...validatedDestination,
      sendIds: validatedDestination.sendIds.map((item) => ({
        userId: item.userId,
        readAt: item.readAt ? item.readAt.toISOString() : null,
      })),
    }

    return {
      id: notification.id.toString(),
      title: notification.title,
      content: notification.content,
      destination: destinationForPrisma,
      createdAt: notification.createdAt,
      updatedAt: notification.updatedAt ?? new Date(),
    }
  }
}
