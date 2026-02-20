import { AdminCreateQuestionUseCase } from '@/domain/application/use-cases/admin/question/admin-create-question-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const AdminCreateQuestionSchema = z.object({
  externalId: z.string().min(1),
  statement: z.string().min(1),
  imageUrl: z.string().url().nullable().optional(),
  alternatives: z.array(z.string()).min(2),
  origin: z.string().min(1),
  subject: z.string().min(1),
  categories: z.array(z.string()),
  correctAnswer: z.number().int().min(0),
  year: z.number().int().min(1900).max(2100).optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
})

type AdminCreateQuestionDto = z.infer<typeof AdminCreateQuestionSchema>

const adminCreateQuestionValidationPipe = new ZodValidationPipe(
  AdminCreateQuestionSchema,
)

type QuestionErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/questions')
export class AdminCreateQuestionController {
  constructor(
    private adminCreateQuestionUseCase: AdminCreateQuestionUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Post()
  async handle(
    @Body(adminCreateQuestionValidationPipe) body: AdminCreateQuestionDto,
  ): Promise<HttpResponse<{ question: unknown }, QuestionErrors>> {
    const result = await this.adminCreateQuestionUseCase.execute(body)

    return {
      success: result.isRight(),
      data: result.isRight() ? { question: result.value.question } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
