import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { MakePlan } from '@test/factories/make-plan'
import { MakeSubscription } from '@test/factories/make-subscription'
import { UpdatePlanUseCase } from './update-plan-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { BillingCycle } from '@/domain/entreprise/entities/plan'

let inMemoryPlansRepository: InMemoryPlansRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let sut: UpdatePlanUseCase

describe('Update Plan', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new UpdatePlanUseCase(
      inMemoryPlansRepository,
      inMemorySubscriptionsRepository,
    )
  })

  it('should be able to update a plan', async () => {
    const plan = MakePlan({ name: 'Pro', slug: 'pro', priceCents: 2990 })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({
      planId: plan.id.toString(),
      name: 'Pro Plus',
      priceCents: 3990,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plan.name).toBe('Pro Plus')
      expect(result.value.plan.priceCents).toBe(3990)
      expect(result.value.plan.slug).toBe('pro')
    }
  })

  it('should be able to update the plan cycle', async () => {
    const plan = MakePlan({ slug: 'pro', cycle: BillingCycle.MONTHLY })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({
      planId: plan.id.toString(),
      cycle: BillingCycle.YEARLY,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plan.cycle).toBe(BillingCycle.YEARLY)
    }
  })

  it('should return error when plan is not found', async () => {
    const result = await sut.execute({
      planId: 'non-existing-id',
      name: 'Pro',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not update slug to one that already exists', async () => {
    const plan1 = MakePlan({ slug: 'pro' })
    const plan2 = MakePlan({ slug: 'basic' })
    await inMemoryPlansRepository.create(plan1)
    await inMemoryPlansRepository.create(plan2)

    const result = await sut.execute({
      planId: plan2.id.toString(),
      slug: 'pro',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should allow updating slug to the same value', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({
      planId: plan.id.toString(),
      slug: 'pro',
      name: 'Pro Updated',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plan.name).toBe('Pro Updated')
    }
  })

  it('should propagate plan name change to all subscriptions', async () => {
    const plan = MakePlan({ name: 'Pro', slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const sub1 = MakeSubscription({
      planId: plan.id,
      planName: 'Pro',
    })
    const sub2 = MakeSubscription({
      planId: plan.id,
      planName: 'Pro',
    })
    await inMemorySubscriptionsRepository.create(sub1)
    await inMemorySubscriptionsRepository.create(sub2)

    const result = await sut.execute({
      planId: plan.id.toString(),
      name: 'Pro Plus',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemorySubscriptionsRepository.items[0].planName).toBe('Pro Plus')
    expect(inMemorySubscriptionsRepository.items[1].planName).toBe('Pro Plus')
  })

  it('should not propagate plan name when name is not changed', async () => {
    const plan = MakePlan({ name: 'Pro', slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const sub = MakeSubscription({
      planId: plan.id,
      planName: 'Pro',
    })
    await inMemorySubscriptionsRepository.create(sub)

    await sut.execute({
      planId: plan.id.toString(),
      priceCents: 5000,
    })

    expect(inMemorySubscriptionsRepository.items[0].planName).toBe('Pro')
  })
})
