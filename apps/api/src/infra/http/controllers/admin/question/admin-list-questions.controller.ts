import { AdminListQuestionsUseCase } from '@/domain/application/use-cases/admin/question/admin-list-questions-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const AdminListQuestionsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
  subject: z.string().optional(),
  year: z.coerce.number().int().optional(),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD']).optional(),
})

type AdminListQuestionsQuery = z.infer<typeof AdminListQuestionsSchema>

const adminListQuestionsValidationPipe = new ZodValidationPipe(
  AdminListQuestionsSchema,
)

@Controller('admin/questions')
export class AdminListQuestionsController {
  constructor(
    private adminListQuestionsUseCase: AdminListQuestionsUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  async handle(
    @Query(adminListQuestionsValidationPipe) query: AdminListQuestionsQuery,
  ): Promise<
    HttpResponse<{
      questions: unknown[]
      totalItems: number
      totalPages: number
      currentPage: number
    }>
  > {
    const result = await this.adminListQuestionsUseCase.execute(query)

    const { questions, meta } = result.value

    return {
      success: true,
      data: {
        questions,
        totalItems: meta.total,
        totalPages: meta.totalPages,
        currentPage: meta.page,
      },
    }
  }
}
