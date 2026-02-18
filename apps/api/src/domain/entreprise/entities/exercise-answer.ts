import { Entity } from '@/core/entities/entity'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'

export interface ExerciseAnswerProps {
  exerciseListId: UniqueEntityID
  questionId: string
  selectedAnswer: number
  isCorrect: boolean | null
  timeSpentSeconds: number
  createdAt: Date
}

export class ExerciseAnswer extends Entity<ExerciseAnswerProps> {
  get exerciseListId() {
    return this.props.exerciseListId
  }

  get questionId() {
    return this.props.questionId
  }

  get selectedAnswer() {
    return this.props.selectedAnswer
  }

  set selectedAnswer(answer: number) {
    this.props.selectedAnswer = answer
  }

  get isCorrect() {
    return this.props.isCorrect
  }

  set isCorrect(correct: boolean | null) {
    this.props.isCorrect = correct
  }

  get timeSpentSeconds() {
    return this.props.timeSpentSeconds
  }

  set timeSpentSeconds(seconds: number) {
    this.props.timeSpentSeconds = seconds
  }

  get createdAt() {
    return this.props.createdAt
  }

  static create(
    props: Optional<ExerciseAnswerProps, 'createdAt' | 'isCorrect' | 'timeSpentSeconds'>,
    id?: UniqueEntityID,
  ): ExerciseAnswer {
    return new ExerciseAnswer(
      {
        ...props,
        isCorrect: props.isCorrect ?? null,
        timeSpentSeconds: props.timeSpentSeconds ?? 0,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    )
  }
}
