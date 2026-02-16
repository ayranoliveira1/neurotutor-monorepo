import { Module } from '@nestjs/common'
import { AccountModule } from './controllers/account/account.module'
import { AdminModule } from './controllers/admin/admin.module'
import { PaymentControllerModule } from './controllers/payment/payment-controller.module'
import { WebhookModule } from './webhooks/webhook.module'

@Module({
  imports: [AccountModule, AdminModule, PaymentControllerModule, WebhookModule],
  controllers: [],
  providers: [],
})
export class HttpModule {}
