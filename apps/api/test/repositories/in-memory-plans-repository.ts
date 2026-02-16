import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { Plan } from '@/domain/entreprise/entities/plan'

export class InMemoryPlansRepository implements PlansRepository {
  public items: Plan[] = []

  async create(plan: Plan): Promise<void> {
    this.items.push(plan)
  }

  async save(plan: Plan): Promise<void> {
    const index = this.items.findIndex(
      (item) => item.id.toString() === plan.id.toString()
    )

    if (index >= 0) {
      this.items[index] = plan
    }
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = this.items.find((item) => item.id.toString() === id)
    return plan ?? null
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const plan = this.items.find((item) => item.slug === slug)
    return plan ?? null
  }

  async findAll(): Promise<Plan[]> {
    return this.items
  }

  async delete(id: string): Promise<void> {
    this.items = this.items.filter((item) => item.id.toString() !== id)
  }
}
