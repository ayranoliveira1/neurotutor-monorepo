import { PlansRepository } from '@/domain/application/repositories/plans-repository'
import { Plan } from '@/domain/entreprise/entities/plan'
import { PlanMapper } from '../mappers/prisma-plan-mapper'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaPlansRepository implements PlansRepository {
  constructor(private prisma: PrismaService) {}

  async create(plan: Plan): Promise<void> {
    const data = PlanMapper.toPrisma(plan)
    await this.prisma.plan.create({ data })
  }

  async save(plan: Plan): Promise<void> {
    const data = PlanMapper.toPrisma(plan)
    await this.prisma.plan.update({
      where: { id: data.id },
      data,
    })
  }

  async findById(id: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({ where: { id } })
    return plan ? PlanMapper.toDomain(plan) : null
  }

  async findBySlug(slug: string): Promise<Plan | null> {
    const plan = await this.prisma.plan.findUnique({ where: { slug } })
    return plan ? PlanMapper.toDomain(plan) : null
  }

  async findAll(): Promise<Plan[]> {
    const plans = await this.prisma.plan.findMany({
      where: { active: true },
      orderBy: { priceCents: 'asc' },
    })
    return plans.map((plan) => PlanMapper.toDomain(plan))
  }

  async delete(id: string): Promise<void> {
    await this.prisma.plan.update({
      where: { id },
      data: { active: false },
    })
  }
}
