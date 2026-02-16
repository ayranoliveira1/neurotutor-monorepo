import { CreateCheckoutUrlUseCase } from '@/domain/application/use-cases/payment/checkout/create-checkout-url-use-case'
import { AuthUser } from '@/infra/auth/auth'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { PublicSubscription } from '@/infra/http/decorators/public-subscription.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const CreateCheckoutUrlSchema = z.object({
  planSlug: z.string().min(1),
})

export type CreateCheckoutUrlDto = z.infer<typeof CreateCheckoutUrlSchema>

const createCheckoutUrlValidationPipe = new ZodValidationPipe(
  CreateCheckoutUrlSchema
)

@Controller('payment/checkout')
export class CreateCheckoutUrlController {
  constructor(private createCheckoutUrlUseCase: CreateCheckoutUrlUseCase) {}

  @PublicSubscription()
  @Post()
  async handle(
    @Body(createCheckoutUrlValidationPipe) body: CreateCheckoutUrlDto,
    @CurrentUser() user: AuthUser
  ): Promise<HttpResponse<{ checkoutUrl: string }, any>> {
    const { planSlug } = body

    const result = await this.createCheckoutUrlUseCase.execute({
      planSlug,
      userId: user.id,
    })

    const payload: HttpResponse<{ checkoutUrl: string }, any> = {
      success: result.isRight(),
      data: result.isRight() ? { checkoutUrl: result.value.checkoutUrl } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }

    return payload
  }
}
