import { ListPlansUseCase } from '@/domain/application/use-cases/admin/plan/list-plans-use-case'
import { Public } from '@/infra/http/decorators/public.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { PlanPresenter } from '@/infra/http/presenters/plan-presenter'
import { Controller, Get } from '@nestjs/common'

type PlanData = ReturnType<typeof PlanPresenter.toHTTP>

@Controller('admin/plans')
export class ListPlansController {
  constructor(private listPlansUseCase: ListPlansUseCase) {}

  @Public()
  @Get()
  async handle(): Promise<HttpResponse<{ plans: PlanData[] }>> {
    const result = await this.listPlansUseCase.execute()

    return {
      success: true,
      data: { plans: result.value.plans.map(PlanPresenter.toHTTP) },
    }
  }
}
