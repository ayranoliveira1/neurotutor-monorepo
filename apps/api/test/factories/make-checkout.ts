import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Checkout, CheckoutProps } from '@/domain/entreprise/entities/checkout'
import { faker } from '@faker-js/faker'

export function MakeCheckout(
  override: Partial<CheckoutProps> = {},
  id?: UniqueEntityID
) {
  const checkout = Checkout.create(
    {
      subscriptionId: new UniqueEntityID(),
      planId: new UniqueEntityID(),
      checkoutSession: faker.string.uuid(),
      paid: false,
      ...override,
    },
    id
  )
  return checkout
}
