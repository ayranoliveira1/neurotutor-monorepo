import { SocketProvider } from '@/domain/application/providers/socket-provider'
import { Notification } from '@/domain/entreprise/entities/notification'

export class FakeSocketProvider implements SocketProvider {
  public notificationsSent: Array<{ notification: Notification }> = []
  public emittedToUsers: Array<{
    userId: string
    event: string
    payload: unknown
  }> = []

  async sendNotification(props: {
    notification: Notification
  }): Promise<void> {
    this.notificationsSent.push(props)
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.emittedToUsers.push({ userId, event, payload })
  }
}
