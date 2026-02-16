import { CheckoutRepository } from '@/domain/application/repositories/checkout-repository'
import { Checkout } from '@/domain/entreprise/entities/checkout'

export class InMemoryCheckoutRepository implements CheckoutRepository {
  public items: Checkout[] = []

  async createCheckout(checkout: Checkout): Promise<void> {
    this.items.push(checkout)
  }

  async updateCheckout(checkout: Checkout): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === checkout.id.toString()
    )

    if (index >= 0) {
      this.items[index] = checkout
    }
  }

  async findByCheckoutSession(
    checkoutSession: string
  ): Promise<Checkout | null> {
    const checkout = this.items.find(
      (item) => item.checkoutSession === checkoutSession
    )
    return checkout ?? null
  }
}
