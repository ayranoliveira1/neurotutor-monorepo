import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { StudyPlanGoal } from './study-plan-goal'

export enum StudyPlanStatus {
  ACTIVE = 'ACTIVE',
  COMPLETED = 'COMPLETED',
  ARCHIVED = 'ARCHIVED',
}

export interface StudyPlanProps {
  userId: UniqueEntityID
  name: string
  description: string | null
  status: StudyPlanStatus
  startDate: Date
  endDate: Date
  goals: StudyPlanGoal[]
  createdAt: Date
  updatedAt?: Date
}

export class StudyPlan extends Entity<StudyPlanProps> {
  get userId() {
    return this.props.userId
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string | null) {
    this.props.description = description
    this.touch()
  }

  get status() {
    return this.props.status
  }

  set status(status: StudyPlanStatus) {
    this.props.status = status
    this.touch()
  }

  get startDate() {
    return this.props.startDate
  }

  set startDate(date: Date) {
    this.props.startDate = date
    this.touch()
  }

  get endDate() {
    return this.props.endDate
  }

  set endDate(date: Date) {
    this.props.endDate = date
    this.touch()
  }

  get goals() {
    return this.props.goals
  }

  set goals(goals: StudyPlanGoal[]) {
    this.props.goals = goals
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
    props: Optional<
      StudyPlanProps,
      'createdAt' | 'updatedAt' | 'status' | 'description' | 'goals'
    >,
    id?: UniqueEntityID,
  ): StudyPlan {
    return new StudyPlan(
      {
        ...props,
        status: props.status ?? StudyPlanStatus.ACTIVE,
        description: props.description ?? null,
        goals: props.goals ?? [],
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
