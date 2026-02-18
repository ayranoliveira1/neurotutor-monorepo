import { GetExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/get-exercise-list-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ExerciseListPresenter } from '@/infra/http/presenters/exercise-list-presenter'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('exercise-lists')
export class GetExerciseListController {
  constructor(private getExerciseListUseCase: GetExerciseListUseCase) {}

  @Get(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.getExerciseListUseCase.execute({
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
            questions: result.value.questions,
            answeredMap: result.value.answeredMap,
            timeMap: result.value.timeMap,
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
