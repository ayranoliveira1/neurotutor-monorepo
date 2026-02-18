import { GetExerciseListResultUseCase } from '@/domain/application/use-cases/exercise-list/get-exercise-list-result-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ExerciseListPresenter } from '@/infra/http/presenters/exercise-list-presenter'
import { ExerciseAnswerPresenter } from '@/infra/http/presenters/exercise-answer-presenter'
import { Controller, Get, Param } from '@nestjs/common'

@Controller('exercise-lists')
export class GetExerciseListResultController {
  constructor(
    private getExerciseListResultUseCase: GetExerciseListResultUseCase,
  ) {}

  @Get(':id/result')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.getExerciseListResultUseCase.execute({
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
            answers: result.value.answers.map(ExerciseAnswerPresenter.toHTTP),
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
