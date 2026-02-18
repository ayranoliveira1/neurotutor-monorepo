import { QuestionsProvider } from '@/domain/application/providers/questions-provider'
import { Controller, Get, Query } from '@nestjs/common'

@Controller('questions')
export class ExerciseListFiltersController {
  constructor(private questionsProvider: QuestionsProvider) {}

  @Get('subjects')
  async subjects() {
    const subjects = await this.questionsProvider.getSubjects()

    return {
      success: true,
      data: subjects,
    }
  }

  @Get('origins')
  async origins() {
    const origins = await this.questionsProvider.getOrigins()

    return {
      success: true,
      data: origins,
    }
  }

  @Get('categories')
  async categories(@Query('subject') subject?: string) {
    const categories = await this.questionsProvider.getCategories(subject)

    return {
      success: true,
      data: categories,
    }
  }
}
