import { Module } from '@nestjs/common'
import { CreateCheckoutUrlController } from './checkout/create-checkout-url.controller'
import { CreateCheckoutUrlUseCase } from '@/domain/application/use-cases/payment/checkout/create-checkout-url-use-case'
import { ChangeSubscriptionPlanController } from './subscription/change-subscription-plan.controller'
import { ChangeSubscriptionPlanUseCase } from '@/domain/application/use-cases/payment/subscription/change-subscription-plan-use-case'

@Module({
  controllers: [CreateCheckoutUrlController, ChangeSubscriptionPlanController],
  providers: [CreateCheckoutUrlUseCase, ChangeSubscriptionPlanUseCase],
})
export class PaymentControllerModule {}
