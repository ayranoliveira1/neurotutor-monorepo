import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { InMemoryCheckoutRepository } from '@test/repositories/in-memory-checkout-repository'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { FakePaymentProvider } from '@test/providers/fake-payment-provider'
import { MakeUser } from '@test/factories/make-user'
import { MakeSubscription } from '@test/factories/make-subscription'
import { MakePlan } from '@test/factories/make-plan'
import { CreateCheckoutUrlUseCase } from './create-checkout-url-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { UnexpectedError } from '@/core/errors/errors/unexpected-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryCheckoutRepository: InMemoryCheckoutRepository
let inMemoryPlansRepository: InMemoryPlansRepository
let fakePaymentProvider: FakePaymentProvider
let sut: CreateCheckoutUrlUseCase

describe('Create Checkout URL', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryCheckoutRepository = new InMemoryCheckoutRepository()
    inMemoryPlansRepository = new InMemoryPlansRepository()
    fakePaymentProvider = new FakePaymentProvider()

    const proPlan = MakePlan({ name: 'Pro', slug: 'pro', priceCents: 2990 })
    await inMemoryPlansRepository.create(proPlan)

    sut = new CreateCheckoutUrlUseCase(
      fakePaymentProvider,
      inMemorySubscriptionsRepository,
      inMemoryCheckoutRepository,
      inMemoryUsersRepository,
      inMemoryPlansRepository
    )
  })

  it('should be able to create a checkout url for pro plan', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({ userId: user.id })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      planSlug: 'pro',
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.checkoutUrl).toContain('pro')
    }
  })

  it('should create a checkout record when user has a subscription', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({ userId: user.id })
    await inMemorySubscriptionsRepository.create(subscription)

    await sut.execute({
      planSlug: 'pro',
      userId: user.id.toString(),
    })

    expect(inMemoryCheckoutRepository.items).toHaveLength(1)
    expect(inMemoryCheckoutRepository.items[0].paid).toBe(false)
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({
      planSlug: 'pro',
      userId: 'non-existing-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error when plan slug is invalid', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      planSlug: 'non-existing-plan',
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error when payment provider fails', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    fakePaymentProvider.shouldFail = true

    const result = await sut.execute({
      planSlug: 'pro',
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UnexpectedError)
  })
})
