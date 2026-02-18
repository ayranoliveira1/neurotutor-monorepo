import { Module } from '@nestjs/common'
import { CreateExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/create-exercise-list-use-case'
import { FetchExerciseListsUseCase } from '@/domain/application/use-cases/exercise-list/fetch-exercise-lists-use-case'
import { GetExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/get-exercise-list-use-case'
import { AnswerExerciseQuestionUseCase } from '@/domain/application/use-cases/exercise-list/answer-exercise-question-use-case'
import { FinishExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/finish-exercise-list-use-case'
import { GetExerciseListResultUseCase } from '@/domain/application/use-cases/exercise-list/get-exercise-list-result-use-case'
import { DeleteExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/delete-exercise-list-use-case'
import { CreateExerciseListController } from './create-exercise-list.controller'
import { FetchExerciseListsController } from './fetch-exercise-lists.controller'
import { GetExerciseListController } from './get-exercise-list.controller'
import { AnswerExerciseQuestionController } from './answer-exercise-question.controller'
import { FinishExerciseListController } from './finish-exercise-list.controller'
import { GetExerciseListResultController } from './get-exercise-list-result.controller'
import { DeleteExerciseListController } from './delete-exercise-list.controller'
import { ExerciseListFiltersController } from './exercise-list-filters.controller'

@Module({
  controllers: [
    CreateExerciseListController,
    FetchExerciseListsController,
    GetExerciseListController,
    AnswerExerciseQuestionController,
    FinishExerciseListController,
    GetExerciseListResultController,
    DeleteExerciseListController,
    ExerciseListFiltersController,
  ],
  providers: [
    CreateExerciseListUseCase,
    FetchExerciseListsUseCase,
    GetExerciseListUseCase,
    AnswerExerciseQuestionUseCase,
    FinishExerciseListUseCase,
    GetExerciseListResultUseCase,
    DeleteExerciseListUseCase,
  ],
})
export class ExerciseListModule {}
