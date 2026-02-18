import { FinishExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/finish-exercise-list-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ExerciseListPresenter } from '@/infra/http/presenters/exercise-list-presenter'
import { Controller, Param, Post } from '@nestjs/common'

@Controller('exercise-lists')
export class FinishExerciseListController {
  constructor(
    private finishExerciseListUseCase: FinishExerciseListUseCase,
  ) {}

  @Post(':id/finish')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.finishExerciseListUseCase.execute({
      userId: user.id,
      exerciseListId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? {
            exerciseList: ExerciseListPresenter.toHTTP(
              result.value.exerciseList,
            ),
            correctCount: result.value.correctCount,
            totalQuestions: result.value.totalQuestions,
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
