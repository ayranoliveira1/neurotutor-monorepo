import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export enum FocusedStudySessionStatus {
  COMPLETED = 'COMPLETED',
  ABANDONED = 'ABANDONED',
}

export interface FocusedStudySessionProps {
  userId: UniqueEntityID
  status: FocusedStudySessionStatus
  pomodoroIntervalMins: number
  breakDurationMins: number
  pomodorosCompleted: number
  totalTimeSpentSeconds: number
  startedAt: Date
  completedAt: Date
  createdAt: Date
  updatedAt: Date
}

export class FocusedStudySession extends Entity<FocusedStudySessionProps> {
  get userId() {
    return this.props.userId
  }

  get status() {
    return this.props.status
  }

  get pomodoroIntervalMins() {
    return this.props.pomodoroIntervalMins
  }

  get breakDurationMins() {
    return this.props.breakDurationMins
  }

  get pomodorosCompleted() {
    return this.props.pomodorosCompleted
  }

  get totalTimeSpentSeconds() {
    return this.props.totalTimeSpentSeconds
  }

  get startedAt() {
    return this.props.startedAt
  }

  get completedAt() {
    return this.props.completedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  static create(
    props: Optional<FocusedStudySessionProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ) {
    const now = new Date()
    return new FocusedStudySession(
      {
        ...props,
        createdAt: props.createdAt ?? now,
        updatedAt: props.updatedAt ?? now,
      },
      id,
    )
  }
}
