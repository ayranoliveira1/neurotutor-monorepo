import { CreateRatingUseCase } from '@/domain/application/use-cases/rating/create-rating-use-case'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { PublicSubscription } from '@/infra/http/decorators/public-subscription.decorator'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { RatingPresenter } from '@/infra/http/presenters/rating-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const CreateRatingSchema = z.object({
  rating: z.number().int().min(1).max(5),
  description: z.string().optional().default(''),
})

type CreateRatingDto = z.infer<typeof CreateRatingSchema>

const createRatingValidationPipe = new ZodValidationPipe(CreateRatingSchema)

type RatingData = ReturnType<typeof RatingPresenter.toHTTP>
type RatingErrors = UseCaseErrorProps<string>['errors']

@Controller('ratings')
export class CreateRatingController {
  constructor(private createRatingUseCase: CreateRatingUseCase) {}

  @PublicSubscription()
  @Post()
  async handle(
    @Body(createRatingValidationPipe) body: CreateRatingDto,
    @CurrentUser() user: { id: string },
  ): Promise<HttpResponse<{ rating: RatingData }, RatingErrors>> {
    const result = await this.createRatingUseCase.execute({
      userId: user.id,
      rating: body.rating,
      description: body.description,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { rating: RatingPresenter.toHTTP(result.value.rating) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
