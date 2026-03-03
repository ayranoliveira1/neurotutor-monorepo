import {
  FocusedStudySessionsRepository,
  FindManyFocusedStudySessionsParams,
  FocusedStudySessionsPagination,
  FocusedStudySessionsStats,
} from '@/domain/application/repositories/focused-study-sessions-repository'
import { FocusedStudySession } from '@/domain/entreprise/entities/focused-study-session'

export class InMemoryFocusedStudySessionsRepository
  implements FocusedStudySessionsRepository
{
  public items: FocusedStudySession[] = []

  async create(session: FocusedStudySession): Promise<void> {
    this.items.push(session)
  }

  async findManyByUserId(
    params: FindManyFocusedStudySessionsParams,
  ): Promise<FocusedStudySessionsPagination> {
    const { userId, page, perPage, startDate, endDate } = params

    let filtered = this.items.filter(
      (i) => i.userId.toString() === userId,
    )

    if (startDate) {
      filtered = filtered.filter((i) => i.createdAt >= startDate)
    }
    if (endDate) {
      filtered = filtered.filter((i) => i.createdAt <= endDate)
    }

    const totalItems = filtered.length
    const sessions = filtered.slice((page - 1) * perPage, page * perPage)

    return {
      sessions,
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

    const filtered = this.items.filter(
      (i) =>
        i.userId.toString() === userId &&
        i.createdAt >= startDate &&
        i.createdAt <= endDate,
    )

    const totalPomodoros = filtered.reduce(
      (acc, s) => acc + s.pomodorosCompleted,
      0,
    )
    const totalTimeSeconds = filtered.reduce(
      (acc, s) => acc + s.totalTimeSpentSeconds,
      0,
    )

    const byDay = filtered.reduce<
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
      totalSessions: filtered.length,
      totalPomodoros,
      totalTimeSeconds,
      sessionsByDay,
    }
  }
}
