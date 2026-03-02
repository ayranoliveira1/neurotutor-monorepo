import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { DomainEvent } from '@/core/events/domain-event'
import { ExerciseList } from '@/domain/entreprise/entities/exercise-list'

export class ExerciseListFinishedEvent implements DomainEvent {
  ocurredAt: Date
  exerciseList: ExerciseList

  constructor(exerciseList: ExerciseList) {
    this.exerciseList = exerciseList
    this.ocurredAt = new Date()
  }

  getAggregateId(): UniqueEntityID {
    return this.exerciseList.id
  }
}
