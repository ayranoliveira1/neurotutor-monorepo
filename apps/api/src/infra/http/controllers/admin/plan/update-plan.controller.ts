import { UpdatePlanUseCase } from '@/domain/application/use-cases/admin/plan/update-plan-use-case'
import { BillingCycle } from '@/domain/entreprise/entities/plan'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { PlanPresenter } from '@/infra/http/presenters/plan-presenter'
import { Body, Controller, Param, Put } from '@nestjs/common'
import z from 'zod'

const UpdatePlanSchema = z.object({
  name: z.string().min(1).optional(),
  slug: z.string().min(1).optional(),
  priceCents: z.number().int().min(0).optional(),
  description: z.string().optional(),
  cycle: z.nativeEnum(BillingCycle).optional(),
  active: z.boolean().optional(),
})

type UpdatePlanDto = z.infer<typeof UpdatePlanSchema>

const updatePlanValidationPipe = new ZodValidationPipe(UpdatePlanSchema)

type PlanData = ReturnType<typeof PlanPresenter.toHTTP>
type PlanErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/plans')
export class UpdatePlanController {
  constructor(private updatePlanUseCase: UpdatePlanUseCase) {}

  @Roles(Role.ADMIN)
  @Put(':id')
  async handle(
    @Param('id') id: string,
    @Body(updatePlanValidationPipe) body: UpdatePlanDto
  ): Promise<HttpResponse<{ plan: PlanData }, PlanErrors>> {
    const result = await this.updatePlanUseCase.execute({
      planId: id,
      ...body,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { plan: PlanPresenter.toHTTP(result.value.plan) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
