import { Injectable } from '@nestjs/common'
import { InjectQueue } from '@nestjs/bullmq'
import { Queue } from 'bullmq'
import {
  EnqueueNotificationRecipientsData,
  NotificationQueueProvider,
} from '@/domain/application/providers/notification-queue-provider'

@Injectable()
export class BullMqNotificationQueueProvider
  implements NotificationQueueProvider
{
  constructor(
    @InjectQueue('notification-recipients')
    private readonly queue: Queue,
  ) {}

  async enqueueRecipients(
    data: EnqueueNotificationRecipientsData,
  ): Promise<void> {
    await this.queue.add('process-recipients', data, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 5000 },
      removeOnComplete: 100,
      removeOnFail: 500,
    })
  }
}
