import { Module } from '@nestjs/common'
import { AssaasWebhook } from './assaas-webhook'

@Module({
  controllers: [AssaasWebhook],
})
export class WebhookModule {}
