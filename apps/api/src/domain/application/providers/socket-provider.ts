import { Notification } from '@/domain/entreprise/entities/notification'

export abstract class SocketProvider {
  abstract sendNotification(props: {
    notification: Notification
  }): Promise<void>
  abstract emitToUser(
    userId: string,
    event: string,
    payload: unknown,
  ): void
}
