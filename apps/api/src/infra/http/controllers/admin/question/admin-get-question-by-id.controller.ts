import { AdminGetQuestionByIdUseCase } from '@/domain/application/use-cases/admin/question/admin-get-question-by-id-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Get, Param } from '@nestjs/common'

type QuestionErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/questions')
export class AdminGetQuestionByIdController {
  constructor(
    private adminGetQuestionByIdUseCase: AdminGetQuestionByIdUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Get(':id')
  async handle(
    @Param('id') id: string,
  ): Promise<HttpResponse<{ question: unknown }, QuestionErrors>> {
    const result = await this.adminGetQuestionByIdUseCase.execute({
      questionId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { question: result.value.question } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
