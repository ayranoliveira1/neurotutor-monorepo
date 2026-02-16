import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  Plan,
  PlanProps,
  BillingCycle,
} from '@/domain/entreprise/entities/plan'
import { faker } from '@faker-js/faker'

export function MakePlan(
  override: Partial<PlanProps> = {},
  id?: UniqueEntityID
) {
  const plan = Plan.create(
    {
      name: faker.commerce.productName(),
      slug: faker.helpers.slugify(faker.commerce.productName()).toLowerCase(),
      priceCents: faker.number.int({ min: 0, max: 50000 }),
      description: faker.commerce.productDescription(),
      cycle: BillingCycle.MONTHLY,
      ...override,
    },
    id
  )
  return plan
}
