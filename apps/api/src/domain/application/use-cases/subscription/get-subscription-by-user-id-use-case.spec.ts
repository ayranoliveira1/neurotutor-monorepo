import { describe, it, expect, beforeEach } from 'vitest'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { MakeSubscription } from '@test/factories/make-subscription'
import { GetSubscriptionByUserIdUseCase } from './get-subscription-by-user-id-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let sut: GetSubscriptionByUserIdUseCase

describe('Get Subscription By User Id', () => {
  beforeEach(() => {
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    sut = new GetSubscriptionByUserIdUseCase(inMemorySubscriptionsRepository)
  })

  it('should be able to get subscription by user id', async () => {
    const userId = new UniqueEntityID()

    const subscription = MakeSubscription({
      userId,
      active: true,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      userId: userId.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.subscription.userId.toString()).toBe(
        userId.toString()
      )
      expect(result.value.subscription.active).toBe(true)
    }
  })

  it('should return error when subscription is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existing-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
