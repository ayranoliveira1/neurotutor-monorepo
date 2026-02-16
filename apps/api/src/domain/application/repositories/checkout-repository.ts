import { Checkout } from '@/domain/entreprise/entities/checkout'

export abstract class CheckoutRepository {
  abstract createCheckout(checkout: Checkout): Promise<void>
  abstract updateCheckout(checkout: Checkout): Promise<void>
  abstract findByCheckoutSession(checkoutSession: string): Promise<Checkout | null>
}