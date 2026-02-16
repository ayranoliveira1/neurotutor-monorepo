import { Controller, Get } from '@nestjs/common'
import { CurrentUser } from '../../decorators/get-user.decorator'
import { GetAccountByIdUseCase } from '@/domain/application/use-cases/account/get-account-by-id-use-case'
import { GetSubscriptionByUserIdUseCase } from '@/domain/application/use-cases/subscription/get-subscription-by-user-id-use-case'
import { PublicSubscription } from '../../decorators/public-subscription.decorator'
import { UserPresenter } from '../../presenters/user-presenter'
import { SubscriptionPresenter } from '../../presenters/subscription-presenter'
import { HttpResponse } from '../../response-type'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { AuthUser } from '@/infra/auth/auth'

interface CurrentUserData {
  user: ReturnType<typeof UserPresenter.toHTTP> & {
    subscription: ReturnType<typeof SubscriptionPresenter.toHTTP> | null
  }
}

type CurrentUserErrors = UseCaseErrorProps<string>['errors']

@Controller('accounts')
export class GetCurrentUserController {
  constructor(
    private getAccountByIdUseCase: GetAccountByIdUseCase,
    private getSubscriptionByUserIdUseCase: GetSubscriptionByUserIdUseCase
  ) {}

  @PublicSubscription()
  @Get('me')
  async handle(
    @CurrentUser() user: AuthUser
  ): Promise<HttpResponse<CurrentUserData, CurrentUserErrors>> {
    const result = await this.getAccountByIdUseCase.execute({
      userId: user.id,
    })

    if (result.isLeft()) {
      return {
        success: false,
        error: result.value.props.errors,
      }
    }

    const userPresented = UserPresenter.toHTTP(result.value.user)

    const subscriptionResult =
      await this.getSubscriptionByUserIdUseCase.execute({
        userId: user.id.toString(),
      })

    const subscription = subscriptionResult.isRight()
      ? SubscriptionPresenter.toHTTP(subscriptionResult.value.subscription)
      : null

    return {
      success: true,
      data: {
        user: {
          ...userPresented,
          subscription,
        },
      },
    }
  }
}
