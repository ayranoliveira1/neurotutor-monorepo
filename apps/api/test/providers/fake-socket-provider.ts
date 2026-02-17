import { SocketProvider } from '@/domain/application/providers/socket-provider'
import { Notification } from '@/domain/entreprise/entities/notification'

export class FakeSocketProvider implements SocketProvider {
  public notificationsSent: Array<{ notification: Notification }> = []

  async sendNotification(props: {
    notification: Notification
  }): Promise<void> {
    this.notificationsSent.push(props)
  }
}
