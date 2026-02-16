import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryUsersRepository } from '@test/repositories/in-memory-users-repository'
import { InMemorySubscriptionsRepository } from '@test/repositories/in-memory-subscriptions-repository'
import { MakeUser } from '@test/factories/make-user'
import { MakeSubscription } from '@test/factories/make-subscription'
import { AdminListUsersUseCase } from './admin-list-users-use-case'
import { Role } from '@/core/enums/enums'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemorySubscriptionsRepository: InMemorySubscriptionsRepository
let sut: AdminListUsersUseCase

describe('Admin List Users', () => {
  beforeEach(() => {
    inMemorySubscriptionsRepository = new InMemorySubscriptionsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository(
      inMemorySubscriptionsRepository,
    )
    sut = new AdminListUsersUseCase(inMemoryUsersRepository)
  })

  it('should list users with pagination', async () => {
    for (let i = 0; i < 25; i++) {
      await inMemoryUsersRepository.save(MakeUser({ name: `User ${i}` }))
    }

    const result = await sut.execute({ page: 1, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(20)
    expect(result.value.totalItems).toBe(25)
    expect(result.value.totalPages).toBe(2)
    expect(result.value.currentPage).toBe(1)
    expect(result.value.offset).toBe(0)
  })

  it('should return second page', async () => {
    for (let i = 0; i < 25; i++) {
      await inMemoryUsersRepository.save(MakeUser({ name: `User ${i}` }))
    }

    const result = await sut.execute({ page: 2, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(5)
    expect(result.value.totalItems).toBe(25)
    expect(result.value.currentPage).toBe(2)
    expect(result.value.offset).toBe(20)
  })

  it('should search users by name', async () => {
    await inMemoryUsersRepository.save(MakeUser({ name: 'João Silva' }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'Maria Santos' }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'João Oliveira' }))

    const result = await sut.execute({ page: 1, perPage: 20, search: 'João' })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(2)
    expect(result.value.totalItems).toBe(2)
  })

  it('should filter users by creation date range', async () => {
    const jan = new Date('2026-01-15')
    const feb = new Date('2026-02-15')
    const mar = new Date('2026-03-15')

    await inMemoryUsersRepository.save(MakeUser({ name: 'User Jan', createdAt: jan }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'User Feb', createdAt: feb }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'User Mar', createdAt: mar }))

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      startDate: new Date('2026-02-01'),
      endDate: new Date('2026-02-28'),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].user.name).toBe('User Feb')
  })

  it('should return empty list when no users exist', async () => {
    const result = await sut.execute({ page: 1, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(0)
    expect(result.value.totalItems).toBe(0)
    expect(result.value.totalPages).toBe(0)
  })

  it('should return subscription alongside each user', async () => {
    const user = MakeUser({ name: 'User com Assinatura' })
    await inMemoryUsersRepository.save(user)

    const subscription = MakeSubscription({
      userId: user.id,
      planName: 'Plano Premium',
      active: true,
    })
    await inMemorySubscriptionsRepository.create(subscription)

    const userWithout = MakeUser({ name: 'User sem Assinatura' })
    await inMemoryUsersRepository.save(userWithout)

    const result = await sut.execute({ page: 1, perPage: 20 })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(2)

    const withSub = result.value.users.find(
      (item) => item.user.id.toString() === user.id.toString(),
    )
    expect(withSub?.subscription).not.toBeNull()
    expect(withSub?.subscription?.planName).toBe('Plano Premium')
    expect(withSub?.subscription?.active).toBe(true)

    const withoutSub = result.value.users.find(
      (item) => item.user.id.toString() === userWithout.id.toString(),
    )
    expect(withoutSub?.subscription).toBeNull()
  })

  it('should filter users by role', async () => {
    await inMemoryUsersRepository.save(MakeUser({ name: 'Admin User', role: Role.ADMIN }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'Student User', role: Role.STUDENT }))
    await inMemoryUsersRepository.save(MakeUser({ name: 'Teacher User', role: Role.TEACHER }))

    const result = await sut.execute({ page: 1, perPage: 20, role: Role.ADMIN })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].user.name).toBe('Admin User')
  })

  it('should filter users by active subscription', async () => {
    const activeUser = MakeUser({ name: 'Active User' })
    await inMemoryUsersRepository.save(activeUser)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: activeUser.id, active: true }),
    )

    const inactiveUser = MakeUser({ name: 'Inactive User' })
    await inMemoryUsersRepository.save(inactiveUser)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: inactiveUser.id, active: false }),
    )

    const noSubUser = MakeUser({ name: 'No Sub User' })
    await inMemoryUsersRepository.save(noSubUser)

    const result = await sut.execute({ page: 1, perPage: 20, active: true })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].user.name).toBe('Active User')
  })

  it('should filter users by planId', async () => {
    const planIdA = new UniqueEntityID()
    const planIdB = new UniqueEntityID()

    const userA = MakeUser({ name: 'User Plan A' })
    await inMemoryUsersRepository.save(userA)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: userA.id, planId: planIdA }),
    )

    const userB = MakeUser({ name: 'User Plan B' })
    await inMemoryUsersRepository.save(userB)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: userB.id, planId: planIdB }),
    )

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      planId: planIdA.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].user.name).toBe('User Plan A')
  })

  it('should combine multiple filters', async () => {
    const planId = new UniqueEntityID()

    const matchUser = MakeUser({ name: 'Match User', role: Role.STUDENT })
    await inMemoryUsersRepository.save(matchUser)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: matchUser.id, planId, active: true }),
    )

    const wrongRole = MakeUser({ name: 'Wrong Role', role: Role.ADMIN })
    await inMemoryUsersRepository.save(wrongRole)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: wrongRole.id, planId, active: true }),
    )

    const wrongPlan = MakeUser({ name: 'Wrong Plan', role: Role.STUDENT })
    await inMemoryUsersRepository.save(wrongPlan)
    await inMemorySubscriptionsRepository.create(
      MakeSubscription({ userId: wrongPlan.id, planId: new UniqueEntityID(), active: true }),
    )

    const result = await sut.execute({
      page: 1,
      perPage: 20,
      role: Role.STUDENT,
      planId: planId.toString(),
      active: true,
    })

    expect(result.isRight()).toBe(true)
    expect(result.value.users).toHaveLength(1)
    expect(result.value.users[0].user.name).toBe('Match User')
  })
})
