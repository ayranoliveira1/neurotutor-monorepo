import { Module } from '@nestjs/common'
import { SaveFocusedStudySessionUseCase } from '@/domain/application/use-cases/focused-study-session/save-focused-study-session-use-case'
import { FetchFocusedStudySessionsUseCase } from '@/domain/application/use-cases/focused-study-session/fetch-focused-study-sessions-use-case'
import { GetFocusedStudySessionsStatsUseCase } from '@/domain/application/use-cases/focused-study-session/get-focused-study-sessions-stats-use-case'
import { SaveFocusedStudySessionController } from './save-focused-study-session.controller'
import { FetchFocusedStudySessionsController } from './fetch-focused-study-sessions.controller'
import { GetFocusedStudySessionsStatsController } from './get-focused-study-sessions-stats.controller'

@Module({
  controllers: [
    SaveFocusedStudySessionController,
    FetchFocusedStudySessionsController,
    GetFocusedStudySessionsStatsController,
  ],
  providers: [
    SaveFocusedStudySessionUseCase,
    FetchFocusedStudySessionsUseCase,
    GetFocusedStudySessionsStatsUseCase,
  ],
})
export class FocusedStudySessionModule {}
