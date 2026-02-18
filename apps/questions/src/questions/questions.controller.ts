import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common'
import { QuestionsService } from './questions.service'
import {
  createQuestionSchema,
  type CreateQuestionDto,
} from './dto/create-question.dto'
import {
  updateQuestionSchema,
  type UpdateQuestionDto,
} from './dto/update-question.dto'
import {
  listQuestionsSchema,
  randomQuestionsSchema,
} from './dto/list-questions.dto'

@Controller('questions')
export class QuestionsController {
  constructor(private questionsService: QuestionsService) {}

  @Post()
  async create(@Body() body: CreateQuestionDto) {
    const data = createQuestionSchema.parse(body)
    return this.questionsService.create(data)
  }

  @Post('bulk')
  async createMany(@Body() body: CreateQuestionDto[]) {
    const data = body.map((item) => createQuestionSchema.parse(item))
    return this.questionsService.createMany(data)
  }

  @Get()
  async findAll(@Query() query: Record<string, string>) {
    const params = listQuestionsSchema.parse(query)
    return this.questionsService.findAll(params)
  }

  @Get('random')
  async findRandom(@Query() query: Record<string, string | string[]>) {
    const params = randomQuestionsSchema.parse(query)
    return this.questionsService.findRandom(params)
  }

  @Get('subjects')
  async getSubjects() {
    return this.questionsService.getSubjects()
  }

  @Get('origins')
  async getOrigins() {
    return this.questionsService.getOrigins()
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.questionsService.findById(id)
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() body: UpdateQuestionDto) {
    const data = updateQuestionSchema.parse(body)
    return this.questionsService.update(id, data)
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    await this.questionsService.delete(id)
  }
}
