import { AdminListUsersUseCase } from '@/domain/application/use-cases/admin/user/admin-list-users-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const AdminListUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
})

type AdminListUsersQuery = z.infer<typeof AdminListUsersSchema>

const adminListUsersValidationPipe = new ZodValidationPipe(AdminListUsersSchema)

type UserData = ReturnType<typeof UserPresenter.toHTTP>

@Controller('admin/users')
export class AdminListUsersController {
  constructor(private adminListUsersUseCase: AdminListUsersUseCase) {}

  @Roles(Role.ADMIN)
  @Get()
  async handle(
    @Query(adminListUsersValidationPipe) query: AdminListUsersQuery
  ): Promise<
    HttpResponse<{
      users: UserData[]
      totalItems: number
      totalPages: number
      currentPage: number
      offset: number
    }>
  > {
    const result = await this.adminListUsersUseCase.execute(query)

    const pagination = result.value

    return {
      success: true,
      data: {
        users: pagination.users.map(UserPresenter.toHTTP),
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
        offset: pagination.offset,
      },
    }
  }
}
