import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { FocusedStudySessionsRepository } from '@/domain/application/repositories/focused-study-sessions-repository'
import {
  FocusedStudySession,
  FocusedStudySessionStatus,
} from '@/domain/entreprise/entities/focused-study-session'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'

export interface SaveFocusedStudySessionUseCaseRequest {
  userId: string
  status: FocusedStudySessionStatus
  pomodoroIntervalMins: number
  breakDurationMins: number
  pomodorosCompleted: number
  totalTimeSpentSeconds: number
  startedAt: Date
  completedAt: Date
}

type SaveFocusedStudySessionUseCaseResponse = Either<
  NotAllowedError<SaveFocusedStudySessionUseCaseRequest>,
  { session: FocusedStudySession }
>

@Injectable()
export class SaveFocusedStudySessionUseCase {
  constructor(
    private focusedStudySessionsRepository: FocusedStudySessionsRepository,
  ) {}

  async execute(
    request: SaveFocusedStudySessionUseCaseRequest,
  ): Promise<SaveFocusedStudySessionUseCaseResponse> {
    const {
      userId,
      status,
      pomodoroIntervalMins,
      breakDurationMins,
      pomodorosCompleted,
      totalTimeSpentSeconds,
      startedAt,
      completedAt,
    } = request

    if (totalTimeSpentSeconds <= 0) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [{ message: 'O tempo total deve ser maior que zero.' }],
        }),
      )
    }

    if (pomodorosCompleted < 0) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            { message: 'O número de pomodoros concluídos não pode ser negativo.' },
          ],
        }),
      )
    }

    if (completedAt <= startedAt) {
      return left(
        new NotAllowedError({
          statusCode: 400,
          errors: [
            { message: 'A data de conclusão deve ser posterior à data de início.' },
          ],
        }),
      )
    }

    const session = FocusedStudySession.create({
      userId: new UniqueEntityID(userId),
      status,
      pomodoroIntervalMins,
      breakDurationMins,
      pomodorosCompleted,
      totalTimeSpentSeconds,
      startedAt,
      completedAt,
    })

    await this.focusedStudySessionsRepository.create(session)

    return right({ session })
  }
}
