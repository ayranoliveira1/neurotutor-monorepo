import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import {
  FocusedStudySessionsRepository,
  FindManyFocusedStudySessionsParams,
  FocusedStudySessionsPagination,
  FocusedStudySessionsStats,
} from '@/domain/application/repositories/focused-study-sessions-repository'
import { FocusedStudySession } from '@/domain/entreprise/entities/focused-study-session'
import { PrismaFocusedStudySessionMapper } from '../mappers/prisma-focused-study-session-mapper'
import { Prisma } from '@/infra/generated/prisma'

@Injectable()
export class PrismaFocusedStudySessionsRepository
  implements FocusedStudySessionsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(session: FocusedStudySession): Promise<void> {
    const data = PrismaFocusedStudySessionMapper.toPrisma(session)
    await this.prisma.focusedStudySession.create({ data })
  }

  async findManyByUserId(
    params: FindManyFocusedStudySessionsParams,
  ): Promise<FocusedStudySessionsPagination> {
    const { userId, page, perPage, startDate, endDate } = params

    const where: Prisma.FocusedStudySessionWhereInput = { userId }

    if (startDate || endDate) {
      where.createdAt = {}
      if (startDate) where.createdAt.gte = startDate
      if (endDate) where.createdAt.lte = endDate
    }

    const [sessions, totalItems] = await Promise.all([
      this.prisma.focusedStudySession.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * perPage,
        take: perPage,
      }),
      this.prisma.focusedStudySession.count({ where }),
    ])

    return {
      sessions: sessions.map(PrismaFocusedStudySessionMapper.toDomain),
      totalItems,
      totalPages: Math.ceil(totalItems / perPage),
      currentPage: page,
    }
  }

  async getStatsByUserId(params: {
    userId: string
    startDate: Date
    endDate: Date
  }): Promise<FocusedStudySessionsStats> {
    const { userId, startDate, endDate } = params

    const sessions = await this.prisma.focusedStudySession.findMany({
      where: {
        userId,
        createdAt: { gte: startDate, lte: endDate },
      },
      select: {
        pomodorosCompleted: true,
        totalTimeSpentSeconds: true,
        createdAt: true,
      },
    })

    const totalPomodoros = sessions.reduce(
      (acc, s) => acc + s.pomodorosCompleted,
      0,
    )
    const totalTimeSeconds = sessions.reduce(
      (acc, s) => acc + s.totalTimeSpentSeconds,
      0,
    )

    const byDay = sessions.reduce<
      Record<string, { count: number; pomodoros: number }>
    >((acc, s) => {
      const date = s.createdAt.toISOString().slice(0, 10)
      if (!acc[date]) acc[date] = { count: 0, pomodoros: 0 }
      acc[date].count++
      acc[date].pomodoros += s.pomodorosCompleted
      return acc
    }, {})

    const sessionsByDay = Object.entries(byDay).map(([date, v]) => ({
      date,
      ...v,
    }))

    return {
      totalSessions: sessions.length,
      totalPomodoros,
      totalTimeSeconds,
      sessionsByDay,
    }
  }
}
