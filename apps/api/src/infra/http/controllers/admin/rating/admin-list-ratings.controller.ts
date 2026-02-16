import { AdminListRatingsUseCase } from '@/domain/application/use-cases/admin/rating/admin-list-ratings-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { RatingPresenter } from '@/infra/http/presenters/rating-presenter'
import { Controller, Get, Query } from '@nestjs/common'
import z from 'zod'

const AdminListRatingsSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(10),
})

type AdminListRatingsQuery = z.infer<typeof AdminListRatingsSchema>

const adminListRatingsValidationPipe = new ZodValidationPipe(
  AdminListRatingsSchema,
)

@Controller('admin/ratings')
export class AdminListRatingsController {
  constructor(
    private adminListRatingsUseCase: AdminListRatingsUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Get()
  async handle(
    @Query(adminListRatingsValidationPipe) query: AdminListRatingsQuery,
  ): Promise<
    HttpResponse<{
      ratings: ReturnType<typeof RatingPresenter.toAdminHTTP>[]
      totalItems: number
      totalPages: number
      currentPage: number
    }>
  > {
    const result = await this.adminListRatingsUseCase.execute(query)

    const pagination = result.value

    return {
      success: true,
      data: {
        ratings: pagination.ratings.map((item) =>
          RatingPresenter.toAdminHTTP(
            item.rating,
            item.userName,
            item.userEmail,
          ),
        ),
        totalItems: pagination.totalItems,
        totalPages: pagination.totalPages,
        currentPage: pagination.currentPage,
      },
    }
  }
}
