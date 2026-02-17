import { Module } from '@nestjs/common'
import { AccountModule } from './controllers/account/account.module'
import { AdminModule } from './controllers/admin/admin.module'
import { PaymentControllerModule } from './controllers/payment/payment-controller.module'
import { WebhookModule } from './webhooks/webhook.module'
import { RatingModule } from './controllers/rating/rating.module'
import { NotificationModule } from './controllers/notification/notification.module'

@Module({
  imports: [AccountModule, AdminModule, PaymentControllerModule, WebhookModule, RatingModule, NotificationModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
