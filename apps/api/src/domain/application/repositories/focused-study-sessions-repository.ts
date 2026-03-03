import { FocusedStudySession } from '@/domain/entreprise/entities/focused-study-session'

export interface FindManyFocusedStudySessionsParams {
  userId: string
  page: number
  perPage: number
  startDate?: Date
  endDate?: Date
}

export interface FocusedStudySessionsPagination {
  sessions: FocusedStudySession[]
  totalItems: number
  totalPages: number
  currentPage: number
}

export interface FocusedStudySessionsStats {
  totalSessions: number
  totalPomodoros: number
  totalTimeSeconds: number
  sessionsByDay: { date: string; count: number; pomodoros: number }[]
}

export abstract class FocusedStudySessionsRepository {
  abstract create(session: FocusedStudySession): Promise<void>
  abstract findManyByUserId(
    params: FindManyFocusedStudySessionsParams,
  ): Promise<FocusedStudySessionsPagination>
  abstract getStatsByUserId(params: {
    userId: string
    startDate: Date
    endDate: Date
  }): Promise<FocusedStudySessionsStats>
}
