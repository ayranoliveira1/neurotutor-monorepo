import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { MakePlan } from '@test/factories/make-plan'
import { ListPlansUseCase } from './list-plans-use-case'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: ListPlansUseCase

describe('List Plans', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    sut = new ListPlansUseCase(inMemoryPlansRepository)
  })

  it('should be able to list all active plans', async () => {
    const plan1 = MakePlan({ slug: 'free', priceCents: 0 })
    const plan2 = MakePlan({ slug: 'pro', priceCents: 2990 })
    await inMemoryPlansRepository.create(plan1)
    await inMemoryPlansRepository.create(plan2)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plans).toHaveLength(2)
    }
  })

  it('should not list inactive plans', async () => {
    const activePlan = MakePlan({ slug: 'pro', active: true })
    const inactivePlan = MakePlan({ slug: 'old', active: false })
    await inMemoryPlansRepository.create(activePlan)
    await inMemoryPlansRepository.create(inactivePlan)

    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plans).toHaveLength(1)
      expect(result.value.plans[0].slug).toBe('pro')
    }
  })

  it('should return empty array when no plans exist', async () => {
    const result = await sut.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plans).toHaveLength(0)
    }
  })
})
