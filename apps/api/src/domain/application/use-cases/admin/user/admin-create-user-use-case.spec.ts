import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { FakeAuthProvider } from '@test/providers/fake-auth-provider'
import { MakePlan } from '@test/factories/make-plan'
import { MakeUser } from '@test/factories/make-user'
import { AdminCreateUserUseCase } from './admin-create-user-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Role } from '@/core/enums/enums'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryPlansRepository: InMemoryPlansRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let fakeAuthProvider: FakeAuthProvider
let sut: AdminCreateUserUseCase

describe('Admin Create User', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryPlansRepository = new InMemoryPlansRepository()
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    fakeAuthProvider = new FakeAuthProvider()

    sut = new AdminCreateUserUseCase(
      inMemoryUsersRepository,
      inMemoryPlansRepository,
      inMemorySubscriptionsRepository,
      fakeAuthProvider,
    )
  })

  it('should be able to create a user with a plan and duration', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('John Doe')
      expect(result.value.user.email).toBe('john@example.com')
    }
    expect(inMemorySubscriptionsRepository.items).toHaveLength(1)
    expect(inMemorySubscriptionsRepository.items[0].planId.toValue()).toBe(
      plan.id.toValue(),
    )
    expect(inMemorySubscriptionsRepository.items[0].active).toBe(true)
  })

  it('should create a subscription with correct end date', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const before = new Date()

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 90,
    })

    expect(result.isRight()).toBe(true)

    const subscription = inMemorySubscriptionsRepository.items[0]
    const expectedEnd = new Date(before)
    expectedEnd.setDate(expectedEnd.getDate() + 90)

    expect(subscription.endDate.getDate()).toBe(expectedEnd.getDate())
    expect(subscription.endDate.getMonth()).toBe(expectedEnd.getMonth())
  })

  it('should be able to create a user with a custom role', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({
      name: 'Teacher User',
      email: 'teacher@example.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 365,
      role: Role.TEACHER,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.role).toBe(Role.TEACHER)
    }
    expect(inMemoryUsersRepository.items).toHaveLength(1)
  })

  it('should not create a user with a duplicate email', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const existingUser = MakeUser({ email: 'john@example.com' })
    await inMemoryUsersRepository.save(existingUser)

    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      planSlug: 'pro',
      durationDays: 30,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not create a user with a non-existent plan', async () => {
    const result = await sut.execute({
      name: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      planSlug: 'non-existent',
      durationDays: 30,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
