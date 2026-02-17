import { Injectable } from '@nestjs/common'
import { NotificationPagination } from '@/core/repositories/notification-pagination'
import { NotificationsRepository } from '@/domain/application/repositories/notifications-repository'
import { Notification } from '@/domain/entreprise/entities/notification'
import { NotificationPrismaMapper } from '../mappers/notification-prisma-mapper'
import { PrismaService } from '../prisma.service'

@Injectable()
export class PrismaNotificationsRepository implements NotificationsRepository {
  constructor(private prisma: PrismaService) {}

  async create(notification: Notification): Promise<void> {
    const data = NotificationPrismaMapper.toPrisma(notification)
    await this.prisma.notification.create({
      data: {
        ...data,
        destination: JSON.parse(JSON.stringify(data.destination)),
      },
    })
  }

  async findById(id: string): Promise<Notification | null> {
    const notification = await this.prisma.notification.findUnique({
      where: { id },
    })
    return notification ? NotificationPrismaMapper.toDomain(notification) : null
  }

  async findByUserId(userId: string): Promise<Notification[]> {
    const notifications = await this.prisma.notification.findMany({
      where: {
        destination: { path: ['sendIds'], array_contains: [{ userId }] },
      },
      orderBy: { createdAt: 'desc' },
    })
    return notifications.map(NotificationPrismaMapper.toDomain)
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
      }),
      this.prisma.notification.count(),
    ])

    return {
      notifications: notifications.map(NotificationPrismaMapper.toDomain),
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
    const data = NotificationPrismaMapper.toPrisma(notification)
    await this.prisma.notification.update({
      where: { id: notification.id.toString() },
      data: {
        ...data,
        destination: JSON.parse(JSON.stringify(data.destination)),
      },
    })
  }
}
