import { CreateStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/create-study-plan-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const goalSchema = z.object({
  subject: z.string().min(1),
  weeklyQuestionsTarget: z.number().int().min(1).max(500),
  targetAccuracyPercent: z.number().int().min(1).max(100).optional().nullable(),
})

const CreateStudyPlanSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).optional().nullable(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  goals: z.array(goalSchema).min(1),
})

type CreateStudyPlanDto = z.infer<typeof CreateStudyPlanSchema>

const createStudyPlanValidationPipe = new ZodValidationPipe(
  CreateStudyPlanSchema,
)

@Controller('study-plans')
export class CreateStudyPlanController {
  constructor(private createStudyPlanUseCase: CreateStudyPlanUseCase) {}

  @Post()
  async handle(
    @Body(createStudyPlanValidationPipe) body: CreateStudyPlanDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.createStudyPlanUseCase.execute({
      userId: user.id,
      name: body.name,
      description: body.description,
      startDate: body.startDate,
      endDate: body.endDate,
      goals: body.goals,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { studyPlan: StudyPlanPresenter.toHTTP(result.value.studyPlan) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
