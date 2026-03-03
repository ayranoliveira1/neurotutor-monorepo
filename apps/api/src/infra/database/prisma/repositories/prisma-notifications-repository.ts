import { Injectable } from '@nestjs/common'
import { NotificationPagination } from '@/core/repositories/notification-pagination'
import { NotificationsRepository } from '@/domain/application/repositories/notifications-repository'
import { Notification } from '@/domain/entreprise/entities/notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { PrismaNotificationMapper } from '../mappers/prisma-notification-mapper'
import { PrismaService } from '../prisma.service'

const includeRecipients = { recipients: true } as const

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = PrismaNotificationMapper.toPrismaCreate(notification)
    await this.prisma.notification.create({ data })
  }

  async createWithoutRecipients(notification: Notification): Promise<void> {
    await this.prisma.notification.create({
      data: {
        id: notification.id.toString(),
        title: notification.title,
        content: notification.content,
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt ?? new Date(),
      },
    })
  }

  async createManyRecipients(
    notificationId: string,
    recipients: Array<{ userId: string }>,
  ): Promise<void> {
    await this.prisma.notificationRecipient.createMany({
      data: recipients.map((r) => ({
        notificationId,
        userId: r.userId,
      })),
      skipDuplicates: true,
    })
  }

  async findByIdOnly(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })
    if (!notification) return null
    return Notification.create(
      {
        title: notification.title,
        content: notification.content,
        destination: { sendIds: [] },
        createdAt: notification.createdAt,
        updatedAt: notification.updatedAt,
      },
      new UniqueEntityID(notification.id),
    )
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
      include: includeRecipients,
    })
    return notification ? PrismaNotificationMapper.toDomain(notification) : null
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: { recipients: { some: { userId } } },
      include: includeRecipients,
      orderBy: { createdAt: 'desc' },
    })
    return notifications.map(PrismaNotificationMapper.toDomain)
  }

  async findAll(params: {
    page: number
    perPage: number
  }): Promise<NotificationPagination> {
    const { page, perPage } = params

    const [notifications, totalItems] = await Promise.all([
      this.prisma.notification.findMany({
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
        include: includeRecipients,
      }),
      this.prisma.notification.count(),
    ])

    return {
      notifications: notifications.map(PrismaNotificationMapper.toDomain),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async delete(id: string): Promise<void> {
    await this.prisma.notification.delete({
      where: { id },
    })
  }

  async save(notification: Notification): Promise<void> {
    const notificationId = notification.id.toString()
    const currentRecipients = notification.sendIds

    await this.prisma.$transaction([
      this.prisma.notification.update({
        where: { id: notificationId },
        data: {
          title: notification.title,
          content: notification.content,
          updatedAt: notification.updatedAt ?? new Date(),
        },
      }),
      this.prisma.notificationRecipient.deleteMany({
        where: {
          notificationId,
          userId: { notIn: currentRecipients.map((r) => r.userId) },
        },
      }),
      ...currentRecipients.map((r) =>
        this.prisma.notificationRecipient.upsert({
          where: {
            notificationId_userId: {
              notificationId,
              userId: r.userId,
            },
          },
          create: {
            notificationId,
            userId: r.userId,
            readAt: r.readAt ?? null,
          },
          update: {
            readAt: r.readAt ?? null,
          },
        })
      ),
    ])
  }

  async saveMany(notifications: Notification[]): Promise<void> {
    const operations = notifications.flatMap((notification) => {
      const notificationId = notification.id.toString()
      const currentRecipients = notification.sendIds

      return [
        this.prisma.notification.update({
          where: { id: notificationId },
          data: {
            title: notification.title,
            content: notification.content,
            updatedAt: notification.updatedAt ?? new Date(),
          },
        }),
        this.prisma.notificationRecipient.deleteMany({
          where: {
            notificationId,
            userId: { notIn: currentRecipients.map((r) => r.userId) },
          },
        }),
        ...currentRecipients.map((r) =>
          this.prisma.notificationRecipient.upsert({
            where: {
              notificationId_userId: {
                notificationId,
                userId: r.userId,
              },
            },
            create: {
              notificationId,
              userId: r.userId,
              readAt: r.readAt ?? null,
            },
            update: {
              readAt: r.readAt ?? null,
            },
          })
        ),
      ]
    })

    await this.prisma.$transaction(operations)
  }
}
