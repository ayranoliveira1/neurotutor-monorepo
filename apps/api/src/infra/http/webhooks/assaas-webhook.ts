import { subscriptionsRepository } from '@/domain/application/repositories/subscriptions-repository'
import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { Subscription } from '@/domain/entreprise/entities/subscription'
import { EnvService } from '@/infra/env/env.service'
import { Body, Controller, Headers, Post } from '@nestjs/common'
import { Public } from '../decorators/public.decorator'
import { CheckoutRepository } from '@/domain/application/repositories/checkout-repository'
import { Checkout } from '@/domain/entreprise/entities/checkout'

export interface SubscriptionCreatedEvent {
  id: string
  event: string
  dateCreated: string
  account: {
    id: string
    ownerId: string | null
  }
  subscription: {
    object: 'subscription'
    id: string
    dateCreated: string
    customer: string
    paymentLink: string | null
    checkoutSession: string | null
    value: number
    nextDueDate: string
    cycle: 'MONTHLY' | 'WEEKLY' | 'YEARLY'
    description: string
    billingType: 'BOLETO' | 'CREDIT_CARD' | 'PIX'
    deleted: boolean
    status: 'ACTIVE' | 'INACTIVE' | 'CANCELED'
    externalReference: string | null
    sendPaymentByPostalService: boolean
    discount: {
      value: number
      limitDate: string | null
      dueDateLimitDays: number
      type: 'PERCENTAGE' | 'FIXED'
    }
    fine: {
      value: number
      type: 'PERCENTAGE' | 'FIXED'
    }
    interest: {
      value: number
      type: 'PERCENTAGE' | 'FIXED'
    }
    split: Array<{
      walletId: string
      fixedValue: number | null
      percentualValue: number | null
      externalReference: string | null
      description: string | null
    }>
  }
}

@Controller('webhook/assaas')
export class AssaasWebhook {
  constructor(
    private envService: EnvService,
    private subscriptionRepository: subscriptionsRepository,
    private checkoutRepository: CheckoutRepository,
    private plansRepository: PlansRepository
  ) {}

  @Public()
  @Post()
  async handle(
    @Body() data: SubscriptionCreatedEvent,
    @Headers('asaas-access-token') token: string
  ) {
    const expectedToken = this.envService.get('ASSAAS_WEBHOOK_TOKEN')

    if (token !== expectedToken) {
      return { status: 'error', message: 'Invalid token' }
    }

    let subscription: Subscription | null = null
    let checkout: Checkout | null = null
    if (data.event === 'SUBSCRIPTION_CREATED') {
      checkout = await this.checkoutRepository.findByCheckoutSession(
        data.subscription.checkoutSession!
      )
      subscription = checkout
        ? await this.subscriptionRepository.findById(
            checkout.subscriptionId.toString()
          )
        : null
    } else {
      subscription = await this.subscriptionRepository.findByExternalId(
        data.subscription.id
      )
    }

    if (subscription) {
      subscription.active = data.subscription.status === 'ACTIVE'

      if (checkout) {
        subscription.planId = checkout.planId
        const plan = await this.plansRepository.findById(
          checkout.planId.toString()
        )
        if (plan) {
          subscription.planName = plan.name
        }
      }

      subscription.externalId = data.subscription.id
      subscription.startDate = new Date(data.subscription.dateCreated)
      subscription.endDate = new Date(data.subscription.nextDueDate)
      await this.subscriptionRepository.update(subscription)

      if (checkout) {
        checkout.paid = true
        await this.checkoutRepository.updateCheckout(checkout)
      }

      return { status: 'success', message: 'Subscription updated' }
    }

    return { status: 'error', message: 'Subscription not found' }
  }
}
