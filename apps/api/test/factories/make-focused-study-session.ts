import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import {
  FocusedStudySession,
  FocusedStudySessionProps,
  FocusedStudySessionStatus,
} from '@/domain/entreprise/entities/focused-study-session'
import { faker } from '@faker-js/faker'

export function MakeFocusedStudySession(
  override: Partial<FocusedStudySessionProps> = {},
  id?: UniqueEntityID,
) {
  const startedAt = override.startedAt ?? faker.date.recent()
  return FocusedStudySession.create(
    {
      userId: override.userId ?? new UniqueEntityID(),
      status: override.status ?? FocusedStudySessionStatus.COMPLETED,
      pomodoroIntervalMins: override.pomodoroIntervalMins ?? 25,
      breakDurationMins: override.breakDurationMins ?? 5,
      pomodorosCompleted: override.pomodorosCompleted ?? 2,
      totalTimeSpentSeconds: override.totalTimeSpentSeconds ?? 3000,
      startedAt,
      completedAt:
        override.completedAt ?? new Date(startedAt.getTime() + 3000 * 1000),
      ...override,
    },
    id,
  )
}
