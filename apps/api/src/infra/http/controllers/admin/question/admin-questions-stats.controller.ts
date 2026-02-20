import { GetQuestionsStatsUseCase } from '@/domain/application/use-cases/admin/question/get-questions-stats-use-case'
import { Role } from '@/core/enums/enums'
import { Roles } from '@/infra/http/decorators/roles.decorator'
import { HttpResponse } from '@/infra/http/response-type'
import { Controller, Get } from '@nestjs/common'
import type { QuestionsStats } from '@/domain/application/providers/questions-provider'

@Controller('admin/questions')
export class AdminQuestionsStatsController {
  constructor(
    private getQuestionsStatsUseCase: GetQuestionsStatsUseCase,
  ) {}

  @Roles(Role.ADMIN)
  @Get('stats')
  async handle(): Promise<HttpResponse<{ stats: QuestionsStats }>> {
    const result = await this.getQuestionsStatsUseCase.execute()

    return {
      success: true,
      data: { stats: result.value.stats },
    }
  }
}
