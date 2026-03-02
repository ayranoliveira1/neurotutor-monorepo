import { EditStudyPlanUseCase } from '@/domain/application/use-cases/study-plan/edit-study-plan-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { StudyPlanPresenter } from '@/infra/http/presenters/study-plan-presenter'
import { Body, Controller, Param, Put } from '@nestjs/common'
import z from 'zod'

const goalSchema = z.object({
  subject: z.string().min(1),
  weeklyQuestionsTarget: z.number().int().min(1).max(500),
  targetAccuracyPercent: z.number().int().min(1).max(100).optional().nullable(),
})

const EditStudyPlanSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional().nullable(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  goals: z.array(goalSchema).min(1).optional(),
})

type EditStudyPlanDto = z.infer<typeof EditStudyPlanSchema>

const editStudyPlanValidationPipe = new ZodValidationPipe(EditStudyPlanSchema)

@Controller('study-plans')
export class EditStudyPlanController {
  constructor(private editStudyPlanUseCase: EditStudyPlanUseCase) {}

  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(editStudyPlanValidationPipe) body: EditStudyPlanDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.editStudyPlanUseCase.execute({
      userId: user.id,
      studyPlanId: id,
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
