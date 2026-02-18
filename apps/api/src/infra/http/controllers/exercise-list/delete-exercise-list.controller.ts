import { DeleteExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/delete-exercise-list-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { Controller, Delete, Param } from '@nestjs/common'

@Controller('exercise-lists')
export class DeleteExerciseListController {
  constructor(
    private deleteExerciseListUseCase: DeleteExerciseListUseCase,
  ) {}

  @Delete(':id')
  async handle(
    @Param('id') id: string,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.deleteExerciseListUseCase.execute({
      userId: user.id,
      exerciseListId: id,
    })

    return {
      success: result.isRight(),
      data: null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
