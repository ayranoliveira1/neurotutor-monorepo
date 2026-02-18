import { FetchExerciseListsUseCase } from '@/domain/application/use-cases/exercise-list/fetch-exercise-lists-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { ExerciseListPresenter } from '@/infra/http/presenters/exercise-list-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const FetchExerciseListsSchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  perPage: z.coerce.number().int().min(1).max(50).optional().default(10),
})

type FetchExerciseListsDto = z.infer<typeof FetchExerciseListsSchema>

const fetchExerciseListsValidationPipe = new ZodValidationPipe(
  FetchExerciseListsSchema,
)

@Controller('exercise-lists')
export class FetchExerciseListsController {
  constructor(
    private fetchExerciseListsUseCase: FetchExerciseListsUseCase,
  ) {}

  @Get()
  async handle(
    @Query(fetchExerciseListsValidationPipe) query: FetchExerciseListsDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.fetchExerciseListsUseCase.execute({
      userId: user.id,
      page: query.page,
      perPage: query.perPage,
    })

    const data = result.value

    return {
      success: true,
      data: {
        exerciseLists: data.exerciseLists.map(ExerciseListPresenter.toHTTP),
        totalItems: data.totalItems,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
      },
    }
  }
}
