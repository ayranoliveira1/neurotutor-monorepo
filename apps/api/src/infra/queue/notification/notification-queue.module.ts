import { Global, Module } from '@nestjs/common'
import { BullModule } from '@nestjs/bullmq'
import { NotificationQueueProvider } from '@/domain/application/providers/notification-queue-provider'
import { BullMqNotificationQueueProvider } from './bullmq-notification-queue-provider'
import { NotificationRecipientsProcessor } from './notification-recipients.processor'

@Global()
@Module({
  imports: [
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
export class NotificationQueueModule {}
