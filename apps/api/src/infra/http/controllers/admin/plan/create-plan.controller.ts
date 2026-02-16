import { CreatePlanUseCase } from '@/domain/application/use-cases/admin/plan/create-plan-use-case'
import { BillingCycle } from '@/domain/entreprise/entities/plan'
import { Role } from '@/core/enums/enums'
import { UseCaseErrorProps } from '@/core/errors/use-case-error'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { HttpResponse } from '@/infra/http/response-type'
import { PlanPresenter } from '@/infra/http/presenters/plan-presenter'
import { Body, Controller, Post } from '@nestjs/common'
import z from 'zod'

const CreatePlanSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  priceCents: z.number().int().min(0),
  description: z.string().optional(),
  cycle: z.nativeEnum(BillingCycle).optional(),
})

type CreatePlanDto = z.infer<typeof CreatePlanSchema>

const createPlanValidationPipe = new ZodValidationPipe(CreatePlanSchema)

type PlanData = ReturnType<typeof PlanPresenter.toHTTP>
type PlanErrors = UseCaseErrorProps<string>['errors']

@Controller('admin/plans')
export class CreatePlanController {
  constructor(private createPlanUseCase: CreatePlanUseCase) {}

  @Roles(Role.ADMIN)
  @Post()
  async handle(
    @Body(createPlanValidationPipe) body: CreatePlanDto
  ): Promise<HttpResponse<{ plan: PlanData }, PlanErrors>> {
    const result = await this.createPlanUseCase.execute(body)

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { plan: PlanPresenter.toHTTP(result.value.plan) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
