import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  StudyPlansRepository,
  type FindManyStudyPlansParams,
} from '@/domain/application/repositories/study-plans-repository'
import { StudyPlan } from '@/domain/entreprise/entities/study-plan'
import { StudyPlanPagination } from '@/core/repositories/study-plan-pagination'
import { StudyPlanMapper } from '../mappers/prisma-study-plan-mapper'
import { StudyPlanGoalMapper } from '../mappers/prisma-study-plan-goal-mapper'
import { Prisma } from '@/infra/generated/prisma'

@Injectable()
export class PrismaStudyPlansRepository implements StudyPlansRepository {
  constructor(private prisma: PrismaService) {}

  async create(studyPlan: StudyPlan): Promise<void> {
    const data = StudyPlanMapper.toPrisma(studyPlan)
    const goalsData = studyPlan.goals.map(StudyPlanGoalMapper.toPrisma)

    await this.prisma.$transaction([
      this.prisma.studyPlan.create({ data }),
      ...(goalsData.length > 0
        ? [this.prisma.studyPlanGoal.createMany({ data: goalsData })]
        : []),
    ])
  }

  async findById(id: string): Promise<StudyPlan | null> {
    const studyPlan = await this.prisma.studyPlan.findUnique({
      where: { id },
      include: { goals: true },
    })

    if (!studyPlan) return null

    return StudyPlanMapper.toDomain(studyPlan)
  }

  async findActiveByUserId(userId: string): Promise<StudyPlan | null> {
    const studyPlan = await this.prisma.studyPlan.findFirst({
      where: { userId, status: 'ACTIVE' },
      include: { goals: true },
    })

    if (!studyPlan) return null

    return StudyPlanMapper.toDomain(studyPlan)
  }

  async findManyByUserId(
    params: FindManyStudyPlansParams,
  ): Promise<StudyPlanPagination> {
    const { userId, page, perPage, status } = params

    const where: Prisma.StudyPlanWhereInput = { userId }

    if (status) {
      where.status = status as Prisma.EnumStudyPlanStatusFilter['equals']
    }

    const [studyPlans, totalItems] = await Promise.all([
      this.prisma.studyPlan.findMany({
        where,
        include: { goals: true },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.studyPlan.count({ where }),
    ])

    return {
      studyPlans: studyPlans.map(StudyPlanMapper.toDomain),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async save(studyPlan: StudyPlan): Promise<void> {
    const data = StudyPlanMapper.toPrisma(studyPlan)
    const goalsData = studyPlan.goals.map(StudyPlanGoalMapper.toPrisma)

    await this.prisma.$transaction([
      this.prisma.studyPlan.update({
        where: { id: data.id },
        data,
      }),
      this.prisma.studyPlanGoal.deleteMany({
        where: { studyPlanId: data.id },
      }),
      ...(goalsData.length > 0
        ? [this.prisma.studyPlanGoal.createMany({ data: goalsData })]
        : []),
    ])
  }

  async delete(id: string): Promise<void> {
    await this.prisma.studyPlan.delete({ where: { id } })
  }
}
