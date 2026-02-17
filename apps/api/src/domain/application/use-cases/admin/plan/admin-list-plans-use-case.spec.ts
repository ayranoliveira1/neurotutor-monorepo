import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { MakePlan } from '@test/factories/make-plan'
import { MakeSubscription } from '@test/factories/make-subscription'
import { AdminListPlansUseCase } from './admin-list-plans-use-case'

let inMemoryPlansRepository: InMemoryPlansRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let sut: AdminListPlansUseCase

describe('Admin List Plans', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new AdminListPlansUseCase(
      inMemoryPlansRepository,
      inMemorySubscriptionsRepository,
    )
  })

  it('should list all plans including inactive ones', async () => {
    const activePlan = MakePlan({ slug: 'pro', active: true })
    const inactivePlan = MakePlan({ slug: 'old', active: false })
    await inMemoryPlansRepository.create(activePlan)
    await inMemoryPlansRepository.create(inactivePlan)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.plans).toHaveLength(2)
  })

  it('should return canDelete true when plan has no subscriptions', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.plans[0].canDelete).toBe(true)
  })

  it('should return canDelete false when plan has subscriptions', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ planId: plan.id, planName: plan.name }),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.plans[0].canDelete).toBe(false)
  })

  it('should correctly identify canDelete for multiple plans', async () => {
    const planWithSub = MakePlan({ slug: 'pro', name: 'Pro' })
    const planWithoutSub = MakePlan({ slug: 'basic', name: 'Basic' })
    await inMemoryPlansRepository.create(planWithSub)
    await inMemoryPlansRepository.create(planWithoutSub)

    await inMemorySubscriptionsRepository.create(
      MakeSubscription({
        planId: planWithSub.id,
        planName: planWithSub.name,
      }),
    )

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.plans).toHaveLength(2)

    const proItem = result.value.plans.find(
      (item) => item.plan.slug === 'pro',
    )
    const basicItem = result.value.plans.find(
      (item) => item.plan.slug === 'basic',
    )

    expect(proItem?.canDelete).toBe(false)
    expect(basicItem?.canDelete).toBe(true)
  })

  it('should return empty array when no plans exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    expect(result.value.plans).toHaveLength(0)
  })
})
