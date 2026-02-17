import { Notification } from '@/domain/entreprise/entities/notification'

export abstract class SocketProvider {
  abstract sendNotification(props: {
    notification: Notification
  }): Promise<void>
}
