import { AdminDeleteQuestionUseCase } from '@/domain/application/use-cases/admin/question/admin-delete-question-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type QuestionErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/questions')
export class AdminDeleteQuestionController {
  constructor(
    private adminDeleteQuestionUseCase: AdminDeleteQuestionUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  async handle(
    @Param('id') id: string,
  ): Promise<HttpResponse<{ message: string }, QuestionErrors>> {
    const result = await this.adminDeleteQuestionUseCase.execute({
      questionId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
