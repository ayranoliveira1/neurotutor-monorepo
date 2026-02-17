import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { MakeUser } from '@test/factories/make-user'
import { MakeSubscription } from '@test/factories/make-subscription'
import { MakePlan } from '@test/factories/make-plan'
import { AdminUpdateUserUseCase } from './admin-update-user-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Role } from '@/core/enums/enums'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let inMemoryPlansRepository: InMemoryPlansRepository
let sut: AdminUpdateUserUseCase

describe('Admin Update User', () => {
  beforeEach(() => {
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryPlansRepository = new InMemoryPlansRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemorySubscriptionsRepository,
    )
    sut = new AdminUpdateUserUseCase(
      inMemoryUsersRepository,
      inMemorySubscriptionsRepository,
      inMemoryPlansRepository,
    )
  })

  it('should update a user name', async () => {
    const user = MakeUser({ name: 'Old Name' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      name: 'New Name',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.name).toBe('New Name')
    }
  })

  it('should update a user email', async () => {
    const user = MakeUser({ email: 'old@example.com' })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      email: 'new@example.com',
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.email).toBe('new@example.com')
    }
  })

  it('should update a user role', async () => {
    const user = MakeUser({ role: Role.STUDENT })
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      role: Role.TEACHER,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.user.role).toBe(Role.TEACHER)
    }
  })

  it('should return error when user is not found', async () => {
    const result = await sut.execute({
      userId: 'non-existent-id',
      name: 'New Name',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not update email if it is already in use', async () => {
    const user1 = MakeUser({ email: 'user1@example.com' })
    const user2 = MakeUser({ email: 'user2@example.com' })
    await inMemoryUsersRepository.save(user1)
    await inMemoryUsersRepository.save(user2)

    const result = await sut.execute({
      userId: user1.id.toString(),
      email: 'user2@example.com',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should update subscription plan', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const oldPlan = MakePlan({ name: 'Plano Básico' })
    const newPlan = MakePlan({ name: 'Plano Premium' })
    await inMemoryPlansRepository.create(oldPlan)
    await inMemoryPlansRepository.create(newPlan)

    const subscription = MakeSubscription({
      userId: user.id,
      planId: oldPlan.id,
      planName: oldPlan.name,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      userId: user.id.toString(),
      planId: newPlan.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    const updated = inMemorySubscriptionsRepository.items[0]
    expect(updated.planId.toString()).toBe(newPlan.id.toString())
    expect(updated.planName).toBe('Plano Premium')
  })

  it('should update subscription endDate', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({ userId: user.id })
    await inMemorySubscriptionsRepository.create(subscription)

    const newEndDate = new Date('2027-06-15')

    const result = await sut.execute({
      userId: user.id.toString(),
      endDate: newEndDate,
    })

    expect(result.isRight()).toBe(true)

    const updated = inMemorySubscriptionsRepository.items[0]
    expect(updated.endDate).toEqual(newEndDate)
  })

  it('should toggle subscription active status', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({
      userId: user.id,
      active: true,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      userId: user.id.toString(),
      active: false,
    })

    expect(result.isRight()).toBe(true)

    const updated = inMemorySubscriptionsRepository.items[0]
    expect(updated.active).toBe(false)
  })

  it('should return error if planId does not exist', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({ userId: user.id })
    await inMemorySubscriptionsRepository.create(subscription)

    const result = await sut.execute({
      userId: user.id.toString(),
      planId: 'non-existent-plan-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })

  it('should return error if user has no subscription', async () => {
    const user = MakeUser()
    await inMemoryUsersRepository.save(user)

    const result = await sut.execute({
      userId: user.id.toString(),
      active: false,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
