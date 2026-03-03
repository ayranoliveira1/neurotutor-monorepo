import { Logger } from '@nestjs/common'
import {
  Processor,
  WorkerHost,
  OnWorkerEvent,
} from '@nestjs/bullmq'
import { Job } from 'bullmq'
import { NotificationsRepository } from '@/domain/application/repositories/notifications-repository'
import { UsersRepository } from '@/domain/application/repositories/users-repository'
import { SocketProvider } from '@/domain/application/providers/socket-provider'
import { EnqueueNotificationRecipientsData } from '@/domain/application/providers/notification-queue-provider'

const RECIPIENT_BATCH_SIZE = 500
const WEBSOCKET_BATCH_SIZE = 100

function yieldEventLoop(): Promise<void> {
  return new Promise((resolve) => setImmediate(resolve))
}

@Processor('notification-recipients')
export class NotificationRecipientsProcessor extends WorkerHost {
  private readonly logger = new Logger(NotificationRecipientsProcessor.name)

  constructor(
    private readonly notificationsRepository: NotificationsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly socketProvider: SocketProvider,
  ) {
    super()
  }

  async process(
    job: Job<EnqueueNotificationRecipientsData>,
  ): Promise<void> {
    const { notificationId, sendToAll, recipientIds } = job.data

    let userIds = recipientIds
    if (sendToAll) {
      userIds = await this.usersRepository.findAllIds()
    }

    const totalUsers = userIds.length

    if (totalUsers === 0) {
      this.logger.warn(
        `Nenhum destinatário para notificação ${notificationId} — removendo notificação órfã`,
      )
      await this.notificationsRepository.delete(notificationId)
      return
    }

    // Insert recipients in batches
    for (let i = 0; i < totalUsers; i += RECIPIENT_BATCH_SIZE) {
      const batch = userIds
        .slice(i, i + RECIPIENT_BATCH_SIZE)
        .map((userId) => ({ userId }))

      await this.notificationsRepository.createManyRecipients(
        notificationId,
        batch,
      )

      const insertProgress = Math.round(((i + batch.length) / totalUsers) * 50)
      await job.updateProgress(insertProgress)

      await yieldEventLoop()
    }

    // Fetch notification without recipients (lightweight query)
    const notification =
      await this.notificationsRepository.findByIdOnly(notificationId)

    if (!notification) {
      this.logger.warn(
        `Notificação ${notificationId} não encontrada após inserir recipients`,
      )
      return
    }

    // Emit WebSocket events in batches
    for (let i = 0; i < totalUsers; i += WEBSOCKET_BATCH_SIZE) {
      const batch = userIds.slice(i, i + WEBSOCKET_BATCH_SIZE)

      for (const userId of batch) {
        const payload = {
          event: 'notification',
          data: {
            notification: {
              id: notification.id.toString(),
              title: notification.title,
              content: notification.content,
              readAt: null,
              createdAt: notification.createdAt,
              updatedAt: notification.updatedAt,
            },
          },
        }
        this.socketProvider.emitToUser(userId, 'notification', payload)
      }

      const wsProgress =
        50 + Math.round(((i + batch.length) / totalUsers) * 50)
      await job.updateProgress(wsProgress)

      await yieldEventLoop()
    }
  }

  @OnWorkerEvent('completed')
  onCompleted(job: Job<EnqueueNotificationRecipientsData>) {
    this.logger.log(
      `Job ${job.id} concluído — notificação ${job.data.notificationId}`,
    )
  }

  @OnWorkerEvent('failed')
  onFailed(job: Job<EnqueueNotificationRecipientsData>, error: Error) {
    this.logger.error(
      `Job ${job.id} falhou — notificação ${job.data.notificationId}: ${error.message}`,
    )
  }
}
