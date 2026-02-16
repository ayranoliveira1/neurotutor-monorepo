import { PaymentProvider } from '@/domain/application/providers/payment-provider'
import { User } from '@/domain/entreprise/entities/user'
import { Plan, BillingCycle } from '@/domain/entreprise/entities/plan'
import { EnvService } from '@/infra/env/env.service'
import { Injectable } from '@nestjs/common'
import axios from 'axios'

const options = {
  headers: {
    accept: 'application/json',
    'content-type': 'application/json',
    access_token: process.env.ASSAAS_API_KEY,
  },
}

@Injectable()
export class AssaasProvider implements PaymentProvider {
  constructor(private envService: EnvService) {}

  private cycleToAssaas(cycle: BillingCycle): string {
    switch (cycle) {
      case BillingCycle.WEEKLY:
        return 'WEEKLY'
      case BillingCycle.MONTHLY:
        return 'MONTHLY'
      case BillingCycle.YEARLY:
        return 'YEARLY'
    }
  }

  async createCheckoutUrl(
    user: User,
    plan: Plan
  ): Promise<{ checkoutUrl: string | null; checkoutSession: string | null }> {
    const CheckoutUrl = 'https://api-sandbox.asaas.com/v3/checkouts'

    const body = {
      billingTypes: ['CREDIT_CARD'],
      chargeTypes: ['RECURRENT'],
      callback: {
        successUrl: this.envService.get('SUCCESS_REDIRECT_URL'),
        cancelUrl: this.envService.get('CANCEL_REDIRECT_URL'),
      },
      items: [
        {
          externalReference: plan.id.toString(),
          name: plan.name,
          quantity: 1,
          value: plan.priceCents / 100,
        },
      ],
      customerData: {
        externalReference: user.id.toString(),
        name: user.name,
        cpfCnpj: user.cpfCnpj,
        email: user.email,
        phone: user.phone,
        address: user.address,
        province: user.province,
        postalCode: user.postalCode,
        addressNumber: Number(user.addressNumber),
      },
      subscription: {
        cycle: this.cycleToAssaas(plan.cycle),
        nextDueDate: new Date().toISOString().split('T')[0],
        description: user.id.toString(),
      },
    }

    const response = await axios.post(CheckoutUrl, body, {
      headers: options.headers,
    })

    return {
      checkoutUrl: response.data.link || null,
      checkoutSession: response.data.id || null,
    }
  }

  async changeSubscriptionPlan(
    externalId: string,
    plan: Plan
  ): Promise<true | false> {
    const UpdateSubscriptionUrl = `https://api-sandbox.asaas.com/v3/subscriptions/${externalId}`

    const body = {
      value: plan.priceCents / 100,
      cycle: this.cycleToAssaas(plan.cycle),
      updatePendingPayments: true,
    }

    const response = await axios.post(UpdateSubscriptionUrl, body, {
      headers: options.headers,
    })

    return response.status === 200
  }
}
