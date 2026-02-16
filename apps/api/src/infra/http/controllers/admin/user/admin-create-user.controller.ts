import { AdminCreateUserUseCase } from '@/domain/application/use-cases/admin/user/admin-create-user-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const AdminCreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
  planSlug: z.string().min(1),
  durationDays: z.number().int().min(1),
  role: z.nativeEnum(Role).optional(),
})

type AdminCreateUserDto = z.infer<typeof AdminCreateUserSchema>

const adminCreateUserValidationPipe = new ZodValidationPipe(
  AdminCreateUserSchema
)

type UserData = ReturnType<typeof UserPresenter.toHTTP>
type UserErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/users')
export class AdminCreateUserController {
  constructor(private adminCreateUserUseCase: AdminCreateUserUseCase) {}

  @Roles(Role.ADMIN)
  @Post()
  async handle(
    @Body(adminCreateUserValidationPipe) body: AdminCreateUserDto
  ): Promise<HttpResponse<{ user: UserData }, UserErrors>> {
    const result = await this.adminCreateUserUseCase.execute(body)

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { user: UserPresenter.toHTTP(result.value.user) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
