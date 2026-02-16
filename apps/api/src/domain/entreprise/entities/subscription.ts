import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface SubscriptionProps {
  userId: UniqueEntityID
  planId: UniqueEntityID
  planName: string
  externalId?: string
  startDate: Date
  endDate: Date
  metadata: Record<string, unknown>
  active: boolean
  createdAt: Date
}

export class Subscription extends Entity<SubscriptionProps> {
  get userId() {
    return this.props.userId
  }

  get planId() {
    return this.props.planId
  }

  set planId(planId: UniqueEntityID) {
    this.props.planId = planId
  }

  get planName() {
    return this.props.planName
  }

  set planName(planName: string) {
    this.props.planName = planName
  }

  get externalId(): string | undefined {
    return this.props.externalId
  }

  set externalId(id: string) {
    this.props.externalId = id
  }

  get startDate() {
    return this.props.startDate
  }

  set startDate(date: Date) {
    this.props.startDate = date
  }

  get endDate() {
    return this.props.endDate
  }

  set endDate(date: Date) {
    this.props.endDate = date
  }

  get createdAt() {
    return this.props.createdAt
  }

  set createdAt(date: Date) {
    this.props.createdAt = date
  }

  get metadata() {
    return this.props.metadata
  }

  set metadata(metadata: Record<string, unknown>) {
    this.props.metadata = metadata
  }

  get active() {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
  }

  static create(
    props: Optional<SubscriptionProps, 'metadata' | 'active' | 'createdAt'>,
    id?: UniqueEntityID
  ) {
    const subscription = new Subscription(
      {
        ...props,
        metadata: props.metadata ?? {},
        active: props.active ?? true,
        createdAt: props.createdAt ?? new Date(),
      },
      id
    )

    return subscription
  }
}
