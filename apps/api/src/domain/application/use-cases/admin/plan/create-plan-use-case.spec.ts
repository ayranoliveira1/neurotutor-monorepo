import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { MakePlan } from '@test/factories/make-plan'
import { CreatePlanUseCase } from './create-plan-use-case'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { BillingCycle } from '@/domain/entreprise/entities/plan'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: CreatePlanUseCase

describe('Create Plan', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    sut = new CreatePlanUseCase(inMemoryPlansRepository)
  })

  it('should be able to create a new plan', async () => {
    const result = await sut.execute({
      name: 'Pro',
      slug: 'pro',
      priceCents: 2990,
      description: 'Plano profissional',
      cycle: BillingCycle.MONTHLY,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plan.name).toBe('Pro')
      expect(result.value.plan.slug).toBe('pro')
      expect(result.value.plan.priceCents).toBe(2990)
    }
    expect(inMemoryPlansRepository.items).toHaveLength(1)
  })

  it('should create a plan with default cycle MONTHLY', async () => {
    const result = await sut.execute({
      name: 'Basic',
      slug: 'basic',
      priceCents: 1990,
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.plan.cycle).toBe(BillingCycle.MONTHLY)
    }
  })

  it('should not create a plan with a duplicate slug', async () => {
    const existingPlan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(existingPlan)

    const result = await sut.execute({
      name: 'Pro 2',
      slug: 'pro',
      priceCents: 3990,
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
