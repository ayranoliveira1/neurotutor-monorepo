import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface StudyPlanGoalProps {
  studyPlanId: UniqueEntityID
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent: number | null
  createdAt: Date
  updatedAt?: Date
}

export class StudyPlanGoal extends Entity<StudyPlanGoalProps> {
  get studyPlanId() {
    return this.props.studyPlanId
  }

  get subject() {
    return this.props.subject
  }

  set subject(subject: string) {
    this.props.subject = subject
    this.touch()
  }

  get weeklyQuestionsTarget() {
    return this.props.weeklyQuestionsTarget
  }

  set weeklyQuestionsTarget(target: number) {
    this.props.weeklyQuestionsTarget = target
    this.touch()
  }

  get targetAccuracyPercent() {
    return this.props.targetAccuracyPercent
  }

  set targetAccuracyPercent(percent: number | null) {
    this.props.targetAccuracyPercent = percent
    this.touch()
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  static create(
    props: Optional<StudyPlanGoalProps, 'createdAt' | 'updatedAt'>,
    id?: UniqueEntityID,
  ): StudyPlanGoal {
    return new StudyPlanGoal(
      {
        ...props,
        targetAccuracyPercent: props.targetAccuracyPercent ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
