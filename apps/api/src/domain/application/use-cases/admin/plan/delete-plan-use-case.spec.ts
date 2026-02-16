import { describe, it, expect, beforeEach } from 'vitest'
import { InMemoryPlansRepository } from '@test/repositories/in-memory-plans-repository'
import { MakePlan } from '@test/factories/make-plan'
import { DeletePlanUseCase } from './delete-plan-use-case'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

let inMemoryPlansRepository: InMemoryPlansRepository
let sut: DeletePlanUseCase

describe('Delete Plan', () => {
  beforeEach(() => {
    inMemoryPlansRepository = new InMemoryPlansRepository()
    sut = new DeletePlanUseCase(inMemoryPlansRepository)
  })

  it('should be able to delete (soft delete) a plan', async () => {
    const plan = MakePlan({ slug: 'pro' })
    await inMemoryPlansRepository.create(plan)

    const result = await sut.execute({ planId: plan.id.toString() })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value.message).toBe('Plano deletado com sucesso.')
    }
    expect(inMemoryPlansRepository.items[0].active).toBe(false)
  })

  it('should return error when plan is not found', async () => {
    const result = await sut.execute({ planId: 'non-existing-id' })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
