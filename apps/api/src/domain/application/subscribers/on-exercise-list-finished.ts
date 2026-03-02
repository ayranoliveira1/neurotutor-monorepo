import { EventHandler } from '@/core/events/event-handler'
import { DomainEvents } from '@/core/events/domain-events'
import { ExerciseListFinishedEvent } from '@/domain/entreprise/events/exercise-list-finished-event'
import { UpdateStudyPlanProgressUseCase } from '@/domain/application/use-cases/study-plan/update-study-plan-progress-use-case'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnExerciseListFinished implements EventHandler {
  constructor(
    private updateStudyPlanProgress: UpdateStudyPlanProgressUseCase,
  ) {
    this.setupSubscriptions()
  }

  setupSubscriptions(): void {
    DomainEvents.register(
      this.handleEvent.bind(this),
      ExerciseListFinishedEvent.name,
    )
  }

  private async handleEvent(event: ExerciseListFinishedEvent) {
    await this.updateStudyPlanProgress.execute({
      exerciseList: event.exerciseList,
    })
  }
}
