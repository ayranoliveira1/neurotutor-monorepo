import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { MakePlan } from '@test/factories/make-plan'
import { MakeSubscription } from '@test/factories/make-subscription'
import { DeletePlanUseCase } from './delete-plan-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryPlansRepository: InMemoryPlansRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let sut: DeletePlanUseCase

describe('Delete Plan', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new DeletePlanUseCase(
      inMemoryPlansRepository,
      inMemorySubscriptionsRepository,
    )
  })

  it('should be able to hard delete a plan without subscriptions', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({ planId: plan.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.message).toBe('Plano deletado com sucesso.')
    }
    expect(inMemoryPlansRepository.items).toHaveLength(0)
  })

  it('should return error when plan is not found', async () => {
    const result = await sut.execute({ planId: 'non-existing-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not delete a plan that has subscriptions', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ planId: plan.id, planName: plan.name }),
    )

    const result = await sut.execute({ planId: plan.id.toString() })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
    expect(inMemoryPlansRepository.items).toHaveLength(1)
  })
})
