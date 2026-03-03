export interface EnqueueNotificationRecipientsData {
  notificationId: string
  sendToAll: boolean
  recipientIds: string[]
}

export abstract class NotificationQueueProvider {
  abstract enqueueRecipients(
    data: EnqueueNotificationRecipientsData,
  ): Promise<void>
}
