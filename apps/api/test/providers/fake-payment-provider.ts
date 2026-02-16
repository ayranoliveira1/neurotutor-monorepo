import { PaymentProvider } from '@/domain/application/providers/payment-provider'
import { User } from '@/domain/entreprise/entities/user'
import { Plan } from '@/domain/entreprise/entities/plan'

export class FakePaymentProvider implements PaymentProvider {
  public shouldFail = false

  async createCheckoutUrl(
    user: User,
    plan: Plan
  ): Promise<{ checkoutUrl: string | null; checkoutSession: string | null }> {
    if (this.shouldFail) {
      return { checkoutUrl: null, checkoutSession: null }
    }

    return {
      checkoutUrl: `https://checkout.fake.com/${plan.slug}?user=${user.id.toString()}`,
      checkoutSession: `session_${plan.slug}_${user.id.toString()}`,
    }
  }

  async changeSubscriptionPlan(
    _externalId: string,
    _plan: Plan
  ): Promise<true | false> {
    if (this.shouldFail) {
      return false
    }
    return true
  }
}
