import {
  EnqueueNotificationRecipientsData,
  NotificationQueueProvider,
} from '@/domain/application/providers/notification-queue-provider'

export class FakeNotificationQueueProvider
  implements NotificationQueueProvider
{
  public enqueuedJobs: EnqueueNotificationRecipientsData[] = []

  async enqueueRecipients(
    data: EnqueueNotificationRecipientsData,
  ): Promise<void> {
    this.enqueuedJobs.push(data)
  }
}
