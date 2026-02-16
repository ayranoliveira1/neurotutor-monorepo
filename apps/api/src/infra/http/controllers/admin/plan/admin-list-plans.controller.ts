import { AdminListPlansUseCase } from '@/domain/application/use-cases/admin/plan/admin-list-plans-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { PlanPresenter } from '@/infra/http/presenters/plan-presenter'
import { Controller, Get } from '@nestjs/common'

type AdminPlanData = ReturnType<typeof PlanPresenter.toAdminHTTP>

@Controller('admin/plans')
export class AdminListPlansController {
  constructor(private adminListPlansUseCase: AdminListPlansUseCase) {}

  @Roles(Role.ADMIN)
  @Get('manage')
  async handle(): Promise<HttpResponse<{ plans: AdminPlanData[] }>> {
    const result = await this.adminListPlansUseCase.execute()

    return {
      success: true,
      data: {
        plans: result.value.plans.map(({ plan, canDelete }) =>
          PlanPresenter.toAdminHTTP(plan, canDelete),
        ),
      },
    }
  }
}
