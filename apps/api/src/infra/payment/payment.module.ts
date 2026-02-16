import { PaymentProvider } from '@/domain/application/providers/payment-provider'
import { Global, Module } from '@nestjs/common'
import { AssaasProvider } from './assaas/assaas-provider'

@Global()
@Module({
  providers: [
    {
      provide: PaymentProvider,
      useClass: AssaasProvider,
    },
  ],
  exports: [PaymentProvider],
})
export class PaymentModule {}
