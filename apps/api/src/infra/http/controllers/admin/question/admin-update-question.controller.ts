import { AdminUpdateQuestionUseCase } from '@/domain/application/use-cases/admin/question/admin-update-question-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { Body, Controller, Param, Put } from '@nestjs/common'
import z from 'zod'

const AdminUpdateQuestionSchema = z.object({
  externalId: z.string().min(1).optional(),
  statement: z.string().min(1).optional(),
  imageUrl: z.string().url().nullable().optional(),
  alternatives: z.array(z.string()).min(2).optional(),
  origin: z.string().min(1).optional(),
  subject: z.string().min(1).optional(),
  categories: z.array(z.string()).optional(),
  correctAnswer: z.number().int().min(0).optional(),
  year: z.number().int().min(1900).max(2100).nullable().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).nullable().optional(),
})

type AdminUpdateQuestionDto = z.infer<typeof AdminUpdateQuestionSchema>

const adminUpdateQuestionValidationPipe = new ZodValidationPipe(
  AdminUpdateQuestionSchema,
)

type QuestionErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/questions')
export class AdminUpdateQuestionController {
  constructor(
    private adminUpdateQuestionUseCase: AdminUpdateQuestionUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(adminUpdateQuestionValidationPipe) body: AdminUpdateQuestionDto,
  ): Promise<HttpResponse<{ question: unknown }, QuestionErrors>> {
    const result = await this.adminUpdateQuestionUseCase.execute({
      questionId: id,
      ...body,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { question: result.value.question } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
