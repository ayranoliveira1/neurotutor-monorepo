import { UpdateAccountUseCase } from '@/domain/application/use-cases/account/update-account-use-case'
import { Body, Controller, Put } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { HttpResponse } from '../../response-type'
import { UserPresenter } from '../../presenters/user-presenter'
import { CurrentUser } from '../../decorators/get-user.decorator'
import { AuthUser } from '@/infra/auth/auth'
import { PublicSubscription } from '../../decorators/public-subscription.decorator'

const updateAccountBodySchema = z.object({
  name: z.string().min(1, 'Name is required').optional(),
  cpfCnpj: z.string().min(1, 'CPF/CNPJ is required').optional(),
  phone: z.string().min(1, 'Phone is required').optional(),
  address: z.string().min(1, 'Address is required').optional(),
  addressNumber: z.string().min(1, 'Address number is required').optional(),
  postalCode: z.string().min(1, 'Postal code is required').optional(),
  province: z.string().min(1, 'Province is required').optional(),
})

type UpdateAccountDto = z.infer<typeof updateAccountBodySchema>

const updateBodyValidation = new ZodValidationPipe(updateAccountBodySchema)

@Controller('accounts/profile')
export class UpdateAccountController {
  constructor(private updateAccountUseCase: UpdateAccountUseCase) {}

  @PublicSubscription()
  @Put()
  async handle(
    @CurrentUser() user: AuthUser,
    @Body(updateBodyValidation) body: UpdateAccountDto
  ): Promise<
    HttpResponse<{ user: ReturnType<typeof UserPresenter.toHTTP> }, any>
  > {
    const {
      name,
      cpfCnpj,
      phone,
      address,
      addressNumber,
      postalCode,
      province,
    } = body

    const result = await this.updateAccountUseCase.execute({
      userId: user.id,
      name,
      cpfCnpj,
      phone,
      address,
      addressNumber,
      postalCode,
      province,
    })

    const payload: HttpResponse<
      { user: ReturnType<typeof UserPresenter.toHTTP> },
      any
    > = {
      success: result.isRight(),
      data: result.isRight()
        ? { user: UserPresenter.toHTTP(result.value.user) }
        : [],
      error: result.isLeft() ? result.value.props.errors : null,
    }

    return payload
  }
}
