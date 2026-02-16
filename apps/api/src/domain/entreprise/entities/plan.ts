import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum BillingCycle {
  WEEKLY = 'WEEKLY',
  MONTHLY = 'MONTHLY',
  YEARLY = 'YEARLY',
}

export interface PlanProps {
  name: string
  slug: string
  priceCents: number
  description?: string
  cycle: BillingCycle
  active: boolean
  createdAt: Date
  updatedAt: Date
}

export class Plan extends Entity<PlanProps> {
  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get slug() {
    return this.props.slug
  }

  set slug(slug: string) {
    this.props.slug = slug
    this.touch()
  }

  get priceCents() {
    return this.props.priceCents
  }

  set priceCents(priceCents: number) {
    this.props.priceCents = priceCents
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | undefined) {
    this.props.description = description
    this.touch()
  }

  get cycle() {
    return this.props.cycle
  }

  set cycle(cycle: BillingCycle) {
    this.props.cycle = cycle
    this.touch()
  }

  get active() {
    return this.props.active
  }

  set active(active: boolean) {
    this.props.active = active
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<PlanProps, 'active' | 'cycle' | 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID
  ) {
    return new Plan(
      {
        ...props,
        active: props.active ?? true,
        cycle: props.cycle ?? BillingCycle.MONTHLY,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id
    )
  }
}
