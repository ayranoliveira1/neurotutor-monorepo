import { CreateExerciseListUseCase } from '@/domain/application/use-cases/exercise-list/create-exercise-list-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { ExerciseListPresenter } from '@/infra/http/presenters/exercise-list-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const sectionSchema = z.object({
  subject: z.string(),
  origin: z.string().optional(),
  quantity: z.number().int().min(1).max(100),
  categories: z.array(z.string()).optional(),
  year: z.number().int().optional(),
  difficulty: z.string().optional(),
})

const CreateExerciseListSchema = z.object({
  name: z.string().min(1).max(200),
  shuffleQuestions: z.boolean().optional().default(false),
  ignoreAnswered: z.boolean().optional().default(false),
  sections: z.array(sectionSchema).min(1),
})

type CreateExerciseListDto = z.infer<typeof CreateExerciseListSchema>

const createExerciseListValidationPipe = new ZodValidationPipe(
  CreateExerciseListSchema,
)

@Controller('exercise-lists')
export class CreateExerciseListController {
  constructor(
    private createExerciseListUseCase: CreateExerciseListUseCase,
  ) {}

  @Post()
  async handle(
    @Body(createExerciseListValidationPipe) body: CreateExerciseListDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.createExerciseListUseCase.execute({
      userId: user.id,
      name: body.name,
      shuffleQuestions: body.shuffleQuestions,
      ignoreAnswered: body.ignoreAnswered,
      sections: body.sections,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? {
            exerciseList: ExerciseListPresenter.toHTTP(
              result.value.exerciseList,
            ),
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
