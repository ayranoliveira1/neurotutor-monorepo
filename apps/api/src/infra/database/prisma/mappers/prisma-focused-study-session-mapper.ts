import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  FocusedStudySession,
  FocusedStudySessionStatus,
} from '@/domain/entreprise/entities/focused-study-session'

export class PrismaFocusedStudySessionMapper {
  static toDomain(raw: any): FocusedStudySession {
    return FocusedStudySession.create(
      {
        userId: new UniqueEntityID(raw.userId),
        status: raw.status as FocusedStudySessionStatus,
        pomodoroIntervalMins: raw.pomodoroIntervalMins,
        breakDurationMins: raw.breakDurationMins,
        pomodorosCompleted: raw.pomodorosCompleted,
        totalTimeSpentSeconds: raw.totalTimeSpentSeconds,
        startedAt: raw.startedAt,
        completedAt: raw.completedAt,
        createdAt: raw.createdAt,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityID(raw.id),
    )
  }

  static toPrisma(session: FocusedStudySession) {
    return {
      id: session.id.toValue(),
      userId: session.userId.toValue(),
      status: session.status,
      pomodoroIntervalMins: session.pomodoroIntervalMins,
      breakDurationMins: session.breakDurationMins,
      pomodorosCompleted: session.pomodorosCompleted,
      totalTimeSpentSeconds: session.totalTimeSpentSeconds,
      startedAt: session.startedAt,
      completedAt: session.completedAt,
      createdAt: session.createdAt,
      updatedAt: session.updatedAt,
    }
  }
}
