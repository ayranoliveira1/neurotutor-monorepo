import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { FakeAuthProvider } from '@test/providers/fake-auth-provider'
import { MakeUser } from '@test/factories/make-user'
import { MakePlan } from '@test/factories/make-plan'
import { CreateAccountUseCase } from './create-account-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryPlansRepository: InMemoryPlansRepository
let fakeAuthProvider: FakeAuthProvider
let sut: CreateAccountUseCase

describe('Create Account', () => {
  beforeEach(async () => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryPlansRepository = new InMemoryPlansRepository()
    fakeAuthProvider = new FakeAuthProvider()

    const freePlan = MakePlan({ name: 'Free', slug: 'free', priceCents: 0 })
    await inMemoryPlansRepository.create(freePlan)

    sut = new CreateAccountUseCase(
      inMemoryUsersRepository,
      inMemorySubscriptionsRepository,
      inMemoryPlansRepository,
      fakeAuthProvider,
    )
  })

  it('should be able to create a new account', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user).toBeDefined()
    }
  })

  it('should create a free trial subscription when creating an account', async () => {
    await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(inMemorySubscriptionsRepository.items).toHaveLength(1)
    expect(inMemorySubscriptionsRepository.items[0].active).toBe(true)
    expect(inMemorySubscriptionsRepository.items[0].planId.toString()).toBe(
      inMemoryPlansRepository.items[0].id.toString(),
    )
  })

  it('should not create an account with an existing email', async () => {
    const existingUser = MakeUser({ email: 'john@example.com' })
    await inMemoryUsersRepository.save(existingUser)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: 'password123',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
