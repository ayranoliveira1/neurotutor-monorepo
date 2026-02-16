import { User } from '@/domain/entreprise/entities/user'
import { Plan } from '@/domain/entreprise/entities/plan'

export abstract class PaymentProvider {
  abstract createCheckoutUrl(
    user: User,
    plan: Plan
  ): Promise<{ checkoutUrl: string | null; checkoutSession: string | null }>
  abstract changeSubscriptionPlan(
    externalId: string,
    plan: Plan
  ): Promise<true | false>
}
