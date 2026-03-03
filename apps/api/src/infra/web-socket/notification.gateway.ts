import { Logger } from '@nestjs/common'
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { SocketProvider } from '@/domain/application/providers/socket-provider'
import { Notification } from '@/domain/entreprise/entities/notification'
import { NotificationPresenter } from '../http/presenters/notification-presenter'
import { auth } from '@/infra/auth/auth'

interface ClientData {
  userId?: string
}

const DEBUG_ENABLED = process.env.NODE_ENV === 'development'
const CORS_ORIGIN = process.env.CORS_ORIGIN ?? 'http://localhost:3000'

@WebSocketGateway({
  cors: { origin: CORS_ORIGIN, credentials: true },
  pingTimeout: 30000,
  pingInterval: 25000,
})
export class NotificationGateway
  implements
    OnGatewayInit,
    OnGatewayConnection,
    OnGatewayDisconnect,
    SocketProvider
{
  private readonly logger = new Logger(NotificationGateway.name)

  @WebSocketServer() io!: Server

  afterInit() {
    if (DEBUG_ENABLED) {
      this.logger.log('WebSocket gateway inicializado')
    }
  }

  async handleConnection(client: Socket & { data: ClientData }) {
    try {
      const cookieHeader = client.handshake.headers.cookie

      if (!cookieHeader) {
        if (DEBUG_ENABLED) {
          this.logger.warn(`[${client.id}] conexão sem cookie`)
        }
        client.disconnect(true)
        return
      }

      const headers = new Headers()
      headers.set('cookie', cookieHeader)

      const session = await auth.api.getSession({ headers })

      if (!session?.user) {
        if (DEBUG_ENABLED) {
          this.logger.warn(`[${client.id}] sessão inválida`)
        }
        client.disconnect(true)
        return
      }

      client.data.userId = session.user.id
      client.join(`user:${session.user.id}`)

      if (DEBUG_ENABLED) {
        this.logger.log(
          `[${client.id}] conectado como USER ${session.user.id}`,
        )
      }
    } catch (err) {
      this.logger.error(
        `[${client.id}] erro na conexão: ${err instanceof Error ? err.message : String(err)}`,
      )
      client.disconnect(true)
    }
  }

  handleDisconnect(client: Socket & { data: ClientData }) {
    if (DEBUG_ENABLED) {
      this.logger.log(
        `[${client.id}] desconectado (user: ${client.data.userId ?? 'unknown'})`,
      )
    }
  }

  async sendNotification(props: { notification: Notification }): Promise<void> {
    const sendIds = props.notification.sendIds

    for (const recipient of sendIds) {
      const payload = {
        event: 'notification',
        data: {
          notification: NotificationPresenter.toUserHTTP(
            props.notification,
            recipient.userId,
          ),
        },
      }
      this.safeEmit(`user:${recipient.userId}`, 'notification', payload)
    }
  }

  emitToUser(userId: string, event: string, payload: unknown): void {
    this.safeEmit(`user:${userId}`, event, payload)
  }

  @SubscribeMessage('ping')
  handlePing() {
    return { event: 'pong', data: 'pong' }
  }

  private safeEmit(room: string, event: string, payload: unknown) {
    try {
      this.io.to(room).emit(event, payload)
    } catch (err) {
      this.logger.error(
        `Falha ao emitir '${event}' para room '${room}': ${err instanceof Error ? err.message : String(err)}`,
      )
    }
  }
}
