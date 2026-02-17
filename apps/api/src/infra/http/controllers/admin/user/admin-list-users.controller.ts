import { AdminListUsersUseCase } from '@/domain/application/use-cases/admin/user/admin-list-users-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { UserPresenter } from '@/infra/http/presenters/user-presenter'
import { SubscriptionPresenter } from '@/infra/http/presenters/subscription-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const AdminListUsersSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
  search: z.string().optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  role: z.nativeEnum(Role).optional(),
  active: z.preprocess(
    (v) => (v === 'true' ? true : v === 'false' ? false : undefined),
    z.boolean().optional()
  ),
  planId: z.string().min(1).optional(),
})

type AdminListUsersQuery = z.infer<typeof AdminListUsersSchema>

const adminListUsersValidationPipe = new ZodValidationPipe(AdminListUsersSchema)

type UserData = ReturnType<typeof UserPresenter.toHTTP> & {
  subscription: ReturnType<typeof SubscriptionPresenter.toHTTP> | null
}

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
        users: pagination.users.map((item) => ({
          ...UserPresenter.toHTTP(item.user),
          subscription: item.subscription
            ? SubscriptionPresenter.toHTTP(item.subscription)
            : null,
        })),
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
        offset: pagination.offset,
      },
    }
  }
}
