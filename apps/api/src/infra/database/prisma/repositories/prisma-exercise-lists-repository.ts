import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  ExerciseListsRepository,
  type FindManyExerciseListsParams,
} from '@/domain/application/repositories/exercise-lists-repository'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'
import { ExerciseListPagination } from '@/core/repositories/exercise-list-pagination'
import { ExerciseListMapper } from '../mappers/prisma-exercise-list-mapper'
import { Prisma } from '@/infra/generated/prisma'

@Injectable()
export class PrismaExerciseListsRepository implements ExerciseListsRepository {
  constructor(private prisma: PrismaService) {}

  async create(exerciseList: ExerciseList): Promise<void> {
    const data = ExerciseListMapper.toPrisma(exerciseList)
    await this.prisma.exerciseList.create({ data })
  }

  async findById(id: string): Promise<ExerciseList | null> {
    const exerciseList = await this.prisma.exerciseList.findUnique({
      where: { id },
    })

    if (!exerciseList) return null

    return ExerciseListMapper.toDomain(exerciseList)
  }

  async findManyByUserId(
    params: FindManyExerciseListsParams,
  ): Promise<ExerciseListPagination> {
    const { userId, page, perPage, search, status, startDate, endDate } = params

    const where: Prisma.ExerciseListWhereInput = { userId }

    if (search) {
      where.name = { contains: search, mode: 'insensitive' }
    }

    if (status) {
      where.status = status as Prisma.EnumExerciseListStatusFilter['equals']
    }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [exerciseLists, totalItems] = await Promise.all([
      this.prisma.exerciseList.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.exerciseList.count({ where }),
    ])

    const listIds = exerciseLists.map((l) => l.id)

    const timeAggregates =
      listIds.length > 0
        ? await this.prisma.exerciseAnswer.groupBy({
            by: ['exerciseListId'],
            where: { exerciseListId: { in: listIds } },
            _sum: { timeSpentSeconds: true },
            _count: { _all: true },
          })
        : []

    const timeMap = new Map(
      timeAggregates.map((agg) => [
        agg.exerciseListId,
        {
          totalTime: agg._sum.timeSpentSeconds ?? 0,
          count: agg._count._all,
        },
      ]),
    )

    return {
      exerciseLists: exerciseLists.map((raw) => {
        const entity = ExerciseListMapper.toDomain(raw)
        const agg = timeMap.get(raw.id)
        if (agg && agg.totalTime > 0) {
          entity.totalTimeSeconds = agg.totalTime
          entity.avgTimePerQuestion = Math.round(agg.totalTime / agg.count)
        }
        return entity
      }),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async save(exerciseList: ExerciseList): Promise<void> {
    const data = ExerciseListMapper.toPrisma(exerciseList)
    await this.prisma.exerciseList.update({
      where: { id: data.id },
      data,
    })
  }

  async delete(id: string): Promise<void> {
    await this.prisma.exerciseList.delete({ where: { id } })
  }
}
