import { Plan } from '@/domain/entreprise/entities/plan'

export abstract class PlansRepository {
  abstract create(plan: Plan): Promise<void>
  abstract save(plan: Plan): Promise<void>
  abstract findById(id: string): Promise<Plan | null>
  abstract findBySlug(slug: string): Promise<Plan | null>
  abstract findAll(): Promise<Plan[]>
  abstract delete(id: string): Promise<void>
}
