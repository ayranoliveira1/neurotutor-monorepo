import { SocketProvider } from '@/domain/application/providers/socket-provider'
import { Global, Module } from '@nestjs/common'
import { NotificationGateway } from './notification.gateway'

@Global()
@Module({
  providers: [
    {
      provide: SocketProvider,
      useClass: NotificationGateway,
    },
  ],
  exports: [SocketProvider],
})
export class WebSocketModule {}
