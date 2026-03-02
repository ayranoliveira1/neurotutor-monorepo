import { AggregateRoot } from '@/core/entities/aggregate-root'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { ExerciseListFinishedEvent } from '@/domain/entreprise/events/exercise-list-finished-event'

export enum ExerciseListStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  FINISHED = 'FINISHED',
}

export interface ExerciseListSection {
  subject: string
  origin?: string
  quantity: number
  categories?: string[]
  year?: number
  difficulty?: string
}

export interface ExerciseListProps {
  userId: UniqueEntityID
  name: string
  shuffleQuestions: boolean
  ignoreAnswered: boolean
  sections: ExerciseListSection[]
  questionIds: string[]
  questionSubjectMap: Record<string, string>
  totalQuestions: number
  status: ExerciseListStatus
  correctCount: number | null
  totalTimeSeconds: number | null
  avgTimePerQuestion: number | null
  createdAt: Date
  updatedAt?: Date
}

export class ExerciseList extends AggregateRoot<ExerciseListProps> {
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

  get shuffleQuestions() {
    return this.props.shuffleQuestions
  }

  get ignoreAnswered() {
    return this.props.ignoreAnswered
  }

  get sections() {
    return this.props.sections
  }

  get questionIds() {
    return this.props.questionIds
  }

  get questionSubjectMap() {
    return this.props.questionSubjectMap
  }

  get totalQuestions() {
    return this.props.totalQuestions
  }

  get status() {
    return this.props.status
  }

  set status(status: ExerciseListStatus) {
    if (
      status === ExerciseListStatus.FINISHED &&
      this.props.status !== ExerciseListStatus.FINISHED
    ) {
      this.addDomainEvent(new ExerciseListFinishedEvent(this))
    }
    this.props.status = status
    this.touch()
  }

  get correctCount() {
    return this.props.correctCount
  }

  set correctCount(count: number | null) {
    this.props.correctCount = count
    this.touch()
  }

  get totalTimeSeconds() {
    return this.props.totalTimeSeconds
  }

  set totalTimeSeconds(seconds: number | null) {
    this.props.totalTimeSeconds = seconds
  }

  get avgTimePerQuestion() {
    return this.props.avgTimePerQuestion
  }

  set avgTimePerQuestion(seconds: number | null) {
    this.props.avgTimePerQuestion = seconds
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
      ExerciseListProps,
      | 'createdAt'
      | 'updatedAt'
      | 'status'
      | 'correctCount'
      | 'totalTimeSeconds'
      | 'avgTimePerQuestion'
      | 'shuffleQuestions'
      | 'ignoreAnswered'
      | 'questionSubjectMap'
    >,
    id?: UniqueEntityID,
  ): ExerciseList {
    return new ExerciseList(
      {
        ...props,
        shuffleQuestions: props.shuffleQuestions ?? false,
        ignoreAnswered: props.ignoreAnswered ?? false,
        questionSubjectMap: props.questionSubjectMap ?? {},
        status: props.status ?? ExerciseListStatus.PENDING,
        correctCount: props.correctCount ?? null,
        totalTimeSeconds: props.totalTimeSeconds ?? null,
        avgTimePerQuestion: props.avgTimePerQuestion ?? null,
        createdAt: props.createdAt ?? new Date(),
        updatedAt: props.updatedAt ?? new Date(),
      },
      id,
    )
  }
}
