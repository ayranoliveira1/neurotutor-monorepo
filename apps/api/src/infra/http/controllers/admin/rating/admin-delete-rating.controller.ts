import { AdminDeleteRatingUseCase } from '@/domain/application/use-cases/admin/rating/admin-delete-rating-use-case'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Delete, Param } from '@nestjs/common'

type DeleteRatingErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/ratings')
export class AdminDeleteRatingController {
  constructor(
    private adminDeleteRatingUseCase: AdminDeleteRatingUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Delete(':id')
  async handle(
    @Param('id') id: string,
  ): Promise<HttpResponse<{ message: string }, DeleteRatingErrors>> {
    const result = await this.adminDeleteRatingUseCase.execute({
      ratingId: id,
    })

    return {
      success: result.isRight(),
      data: result.isRight() ? { message: result.value.message } : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
