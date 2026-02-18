import { AnswerExerciseQuestionUseCase } from '@/domain/application/use-cases/exercise-list/answer-exercise-question-use-case'
import { CurrentUser } from '@/infra/http/decorators/get-user.decorator'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation.pipe'
import { ExerciseAnswerPresenter } from '@/infra/http/presenters/exercise-answer-presenter'
import { Body, Controller, Param, Post } from '@nestjs/common'
import z from 'zod'

const AnswerQuestionSchema = z.object({
  questionId: z.string().uuid(),
  selectedAnswer: z.number().int().min(0),
  timeSpentSeconds: z.number().int().min(0).optional().default(0),
})

type AnswerQuestionDto = z.infer<typeof AnswerQuestionSchema>

const answerQuestionValidationPipe = new ZodValidationPipe(AnswerQuestionSchema)

@Controller('exercise-lists')
export class AnswerExerciseQuestionController {
  constructor(
    private answerExerciseQuestionUseCase: AnswerExerciseQuestionUseCase,
  ) {}

  @Post(':id/answer')
  async handle(
    @Param('id') id: string,
    @Body(answerQuestionValidationPipe) body: AnswerQuestionDto,
    @CurrentUser() user: { id: string },
  ) {
    const result = await this.answerExerciseQuestionUseCase.execute({
      userId: user.id,
      exerciseListId: id,
      questionId: body.questionId,
      selectedAnswer: body.selectedAnswer,
      timeSpentSeconds: body.timeSpentSeconds,
    })

    return {
      success: result.isRight(),
      data: result.isRight()
        ? { answer: ExerciseAnswerPresenter.toHTTP(result.value.answer) }
        : null,
      error: result.isLeft() ? result.value.props.errors : null,
    }
  }
}
