import { CreateAccountUseCase } from '@/domain/application/use-cases/account/create-account-use-case'
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { HttpResponse } from '../../response-type'
import { Public } from '../../decorators/public.decorator'
import { UserPresenter } from '../../presenters/user-presenter'
import { Throttle } from '@nestjs/throttler'

const createAccountBodySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type CreateAccountDto = z.infer<typeof createAccountBodySchema>

const createBodyValidation = new ZodValidationPipe(createAccountBodySchema)

@Controller('accounts/sign-up')
export class CreateAccountController {
  constructor(private createAccountUseCase: CreateAccountUseCase) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @UsePipes(createBodyValidation)
  async handle(
    @Body() body: CreateAccountDto
  ): Promise<
    HttpResponse<{ user: ReturnType<typeof UserPresenter.toHTTP> }, any>
  > {
    const { name, email, password } = body

    const result = await this.createAccountUseCase.execute({
      name,
      email,
      password,
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
