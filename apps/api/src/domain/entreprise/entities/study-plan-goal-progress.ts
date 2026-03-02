import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudyPlanGoalProgressProps {
  studyPlanId: UniqueEntityID
  goalId: UniqueEntityID
  subject: string
  totalAnswered: number
  correctCount: number
  updatedAt?: Date
}

export class StudyPlanGoalProgress extends Entity<StudyPlanGoalProgressProps> {
  get studyPlanId() {
    return this.props.studyPlanId
  }

  get goalId() {
    return this.props.goalId
  }

  get subject() {
    return this.props.subject
  }

  get totalAnswered() {
    return this.props.totalAnswered
  }

  set totalAnswered(value: number) {
    this.props.totalAnswered = value
    this.touch()
  }

  get correctCount() {
    return this.props.correctCount
  }

  set correctCount(value: number) {
    this.props.correctCount = value
    this.touch()
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<StudyPlanGoalProgressProps, 'updatedAt' | 'totalAnswered' | 'correctCount'>,
    id?: UniqueEntityID,
  ): StudyPlanGoalProgress {
    return new StudyPlanGoalProgress(
      {
        ...props,
        totalAnswered: props.totalAnswered ?? 0,
        correctCount: props.correctCount ?? 0,
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
