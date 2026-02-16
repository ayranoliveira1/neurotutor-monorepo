import { AdminUpdateUserUseCase } from '@/domain/application/use-cases/admin/user/admin-update-user-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { Body, Controller, Param, Put } from '@nestjs/common'
import z from 'zod'

const AdminUpdateUserSchema = z.object({
  name: z.string().min(1).optional(),
  email: z.string().email().optional(),
  role: z.nativeEnum(Role).optional(),
  planId: z.string().min(1).optional(),
  endDate: z.coerce.date().optional(),
  active: z.boolean().optional(),
})

type AdminUpdateUserDto = z.infer<typeof AdminUpdateUserSchema>

const adminUpdateUserValidationPipe = new ZodValidationPipe(
  AdminUpdateUserSchema
)

type UserData = ReturnType<typeof UserPresenter.toHTTP>
type UserErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/users')
export class AdminUpdateUserController {
  constructor(private adminUpdateUserUseCase: AdminUpdateUserUseCase) {}

  @Roles(Role.ADMIN)
  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(adminUpdateUserValidationPipe) body: AdminUpdateUserDto
  ): Promise<HttpResponse<{ user: UserData }, UserErrors>> {
    const result = await this.adminUpdateUserUseCase.execute({
      userId: id,
      ...body,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { user: UserPresenter.toHTTP(result.value.user) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
