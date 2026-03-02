import { Module } from '@nestjs/common'
import { CreateStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/create-study-plan-use-case'
import { FetchStudyPlansUseCase } from '@/domain/application/use-cases/study-plan/fetch-study-plans-use-case'
import { GetStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/get-study-plan-use-case'
import { GetStudyPlanProgressUseCase } from '@/domain/application/use-cases/study-plan/get-study-plan-progress-use-case'
import { EditStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/edit-study-plan-use-case'
import { DeleteStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/delete-study-plan-use-case'
import { ChangeStudyPlanStatusUseCase } from '@/domain/application/use-cases/study-plan/change-study-plan-status-use-case'
import { UpdateStudyPlanProgressUseCase } from '@/domain/application/use-cases/study-plan/update-study-plan-progress-use-case'
import { OnExerciseListFinished } from '@/domain/application/subscribers/on-exercise-list-finished'
import { CreateStudyPlanController } from './create-study-plan.controller'
import { FetchStudyPlansController } from './fetch-study-plans.controller'
import { GetStudyPlanController } from './get-study-plan.controller'
import { GetStudyPlanProgressController } from './get-study-plan-progress.controller'
import { EditStudyPlanController } from './edit-study-plan.controller'
import { DeleteStudyPlanController } from './delete-study-plan.controller'
import { ChangeStudyPlanStatusController } from './change-study-plan-status.controller'

@Module({
  controllers: [
    CreateStudyPlanController,
    FetchStudyPlansController,
    GetStudyPlanController,
    GetStudyPlanProgressController,
    EditStudyPlanController,
    DeleteStudyPlanController,
    ChangeStudyPlanStatusController,
  ],
  providers: [
    CreateStudyPlanUseCase,
    FetchStudyPlansUseCase,
    GetStudyPlanUseCase,
    GetStudyPlanProgressUseCase,
    EditStudyPlanUseCase,
    DeleteStudyPlanUseCase,
    ChangeStudyPlanStatusUseCase,
    UpdateStudyPlanProgressUseCase,
    OnExerciseListFinished,
  ],
})
export class StudyPlanModule {}
