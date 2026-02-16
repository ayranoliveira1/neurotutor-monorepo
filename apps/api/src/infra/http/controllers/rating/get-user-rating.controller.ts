import { GetUserRatingUseCase } from '@/domain/application/use-cases/rating/get-user-rating-use-case'
import { PublicSubscription } from '@/infra/http/decorators/public-subscription.decorator'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { RatingPresenter } from '@/infra/http/presenters/rating-presenter'
import { Controller, Get } from '@nestjs/common'

type RatingData = ReturnType<typeof RatingPresenter.toHTTP> | null

@Controller('ratings')
export class GetUserRatingController {
  constructor(private getUserRatingUseCase: GetUserRatingUseCase) {}

  @PublicSubscription()
  @Get('me')
  async handle(
    @CurrentUser() user: { id: string },
  ): Promise<HttpResponse<{ rating: RatingData }>> {
    const result = await this.getUserRatingUseCase.execute({
      userId: user.id,
    })

    const rating = result.value.rating

    return {
      success: true,
      data: {
        rating: rating ? RatingPresenter.toHTTP(rating) : null,
      },
    }
  }
}
