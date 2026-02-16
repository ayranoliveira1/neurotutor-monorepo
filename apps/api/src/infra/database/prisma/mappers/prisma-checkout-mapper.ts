import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Checkout } from '@/domain/entreprise/entities/checkout'

export class CheckoutMapper {
  static toDomain(raw: any): Checkout {
    return Checkout.create(
      {
        subscriptionId: new UniqueEntityID(raw.subscriptionId),
        planId: new UniqueEntityID(raw.planId),
        checkoutSession: raw.checkoutSession,
        paid: raw.paid,
        createdAt: raw.createdAt,
      },
      new UniqueEntityID(raw.id)
    )
  }

  static toPrisma(checkout: Checkout) {
    return {
      id: checkout.id.toValue(),
      subscriptionId: checkout.subscriptionId.toValue(),
      planId: checkout.planId.toValue(),
      checkoutSession: checkout.checkoutSession,
      paid: checkout.paid,
      createdAt: checkout.createdAt,
    }
  }
}
