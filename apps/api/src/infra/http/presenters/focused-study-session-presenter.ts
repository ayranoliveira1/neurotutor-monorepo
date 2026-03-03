import { FocusedStudySession } from '@/domain/entreprise/entities/focused-study-session'

export class FocusedStudySessionPresenter {
  static toHTTP(session: FocusedStudySession) {
    return {
      id: session.id.toString(),
      userId: session.userId.toString(),
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
