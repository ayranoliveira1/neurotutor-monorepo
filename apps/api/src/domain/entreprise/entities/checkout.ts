import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface CheckoutProps {
  subscriptionId: UniqueEntityID
  planId: UniqueEntityID
  checkoutSession: string
  paid: boolean
  createdAt: Date
}

export class Checkout extends Entity<CheckoutProps> {
  get subscriptionId() {
    return this.props.subscriptionId
  }

  get planId() {
    return this.props.planId
  }

  set planId(planId: UniqueEntityID) {
    this.props.planId = planId
  }

  get checkoutSession() {
    return this.props.checkoutSession
  }

  set checkoutSession(session: string) {
    this.props.checkoutSession = session
  }

  get paid() {
    return this.props.paid
  }

  set paid(paid: boolean) {
    this.props.paid = paid
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(date: Date) {
    this.props.createdAt = date
  }

  static create(
    props: Optional<CheckoutProps, 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const checkout = new Checkout(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return checkout
  }
}
