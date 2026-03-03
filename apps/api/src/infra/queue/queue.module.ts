import { Global, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { EnvService } from '@/infra/env/env.service'
import { NotificationQueueProvider } from '@/domain/application/providers/notification-queue-provider'
import { BullMqNotificationQueueProvider } from './bullmq-notification-queue-provider'
import { NotificationRecipientsProcessor } from './notification-recipients.processor'

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      inject: [EnvService],
      useFactory: (env: EnvService) => ({
        connection: {
          host: env.get('REDIS_HOST'),
          port: env.get('REDIS_PORT'),
        },
      }),
    }),
    BullModule.registerQueue({ name: 'notification-recipients' }),
  ],
  providers: [
    NotificationRecipientsProcessor,
    {
      provide: NotificationQueueProvider,
      useClass: BullMqNotificationQueueProvider,
    },
  ],
  exports: [NotificationQueueProvider],
})
export class QueueModule {}
