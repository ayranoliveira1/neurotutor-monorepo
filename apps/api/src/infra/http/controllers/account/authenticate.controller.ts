import { AuthenticateAccountUseCase } from '@/domain/application/use-cases/account/authenticate-account-use-case'
import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common'
import { Response } from 'express'
import z from 'zod'
import { ZodValidationPipe } from '../../pipes/zod-validation.pipe'
import { HttpResponse } from '../../response-type'
import { UserPresenter } from '../../presenters/user-presenter'
import { Public } from '../../decorators/public.decorator'
import { Throttle } from '@nestjs/throttler'

const authenticateAccountBodySchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
})

type AuthenticateAccountDto = z.infer<typeof authenticateAccountBodySchema>

const authenticateBodyValidation = new ZodValidationPipe(
  authenticateAccountBodySchema
)

@Controller('accounts/sign-in')
export class AuthenticateAccountController {
  constructor(private authenticateAccountUseCase: AuthenticateAccountUseCase) {}

  @Public()
  @Throttle({ default: { limit: 10, ttl: 60000 } })
  @Post()
  @UsePipes(authenticateBodyValidation)
  async handle(
    @Body() body: AuthenticateAccountDto,
    @Res({ passthrough: true }) res: Response
  ): Promise<
    HttpResponse<{ user: ReturnType<typeof UserPresenter.toHTTP> }, any>
  > {
    const { email, password } = body

    const result = await this.authenticateAccountUseCase.execute({
      email,
      password,
    })

    const cookies = result.isRight()
      ? result.value.headers?.['set-cookie']
      : undefined
    if (cookies) {
      res.setHeader('set-cookie', cookies)
    }

    const payload: HttpResponse<
      { user: ReturnType<typeof UserPresenter.toHTTP> },
      any
    > = {
      success: result.isRight(),
      data: result.isRight()
        ? { user: UserPresenter.toHTTP(result.value.user) }
        : undefined,
      error: result.isLeft() ? result.value.props.errors : null,
    }

    return payload
  }
}
