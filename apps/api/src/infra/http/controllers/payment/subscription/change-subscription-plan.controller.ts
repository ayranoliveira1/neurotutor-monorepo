import { ChangeSubscriptionPlanUseCase } from '@/domain/application/use-cases/payment/subscription/change-subscription-plan-use-case'
import { AuthUser } from '@/infra/auth/auth'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { PublicSubscription } from '@/infra/http/decorators/public-subscription.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { SubscriptionPresenter } from '@/infra/http/presenters/subscription-presenter'
import { HttpResponse } from '@/infra/http/response-type'
import { Body, Controller, Put } from '@nestjs/common'
import z from 'zod'

const changeSubscriptionPlanSchema = z.object({
  planSlug: z.string().min(1),
})

export type ChangeSubscriptionPlanDto = z.infer<
  typeof changeSubscriptionPlanSchema
>

const changeSubscriptionPlanValidationPipe = new ZodValidationPipe(
  changeSubscriptionPlanSchema
)

@Controller('payment/subscription/change-plan')
export class ChangeSubscriptionPlanController {
  constructor(
    private changeSubscriptionPlanUseCase: ChangeSubscriptionPlanUseCase
  ) {}

  @PublicSubscription()
  @Put()
  async handle(
    @CurrentUser() user: AuthUser,
    @Body(changeSubscriptionPlanValidationPipe) body: ChangeSubscriptionPlanDto
  ): Promise<
    HttpResponse<
      { subscription: ReturnType<typeof SubscriptionPresenter.toHTTP> },
      any
    >
  > {
    const { planSlug } = body

    const result = await this.changeSubscriptionPlanUseCase.execute({
      userId: user.id,
      planSlug,
    })

    const payload: HttpResponse<
      { subscription: ReturnType<typeof SubscriptionPresenter.toHTTP> },
      any
    > = {
      success: result.isRight(),
      data: result.isRight()
        ? {
            subscription: SubscriptionPresenter.toHTTP(
              result.value.subscription
            ),
          }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }

    return payload
  }
}
