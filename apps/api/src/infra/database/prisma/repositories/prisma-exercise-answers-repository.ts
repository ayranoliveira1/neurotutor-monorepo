import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { ExerciseAnswersRepository } from '@/domain/application/repositories/exercise-answers-repository'
import { ExerciseAnswer } from '@/domain/entreprise/entities/exercise-answer'
import { ExerciseAnswerMapper } from '../mappers/prisma-exercise-answer-mapper'

@Injectable()
export class PrismaExerciseAnswersRepository
  implements ExerciseAnswersRepository
{
  constructor(private prisma: PrismaService) {}

  async createOrUpdate(answer: ExerciseAnswer): Promise<void> {
    const data = ExerciseAnswerMapper.toPrisma(answer)

    await this.prisma.exerciseAnswer.upsert({
      where: {
        exerciseListId_questionId: {
          exerciseListId: data.exerciseListId,
          questionId: data.questionId,
        },
      },
      create: data,
      update: {
        selectedAnswer: data.selectedAnswer,
        isCorrect: data.isCorrect,
        timeSpentSeconds: data.timeSpentSeconds,
      },
    })
  }

  async findByListAndQuestion(
    exerciseListId: string,
    questionId: string,
  ): Promise<ExerciseAnswer | null> {
    const answer = await this.prisma.exerciseAnswer.findUnique({
      where: {
        exerciseListId_questionId: {
          exerciseListId,
          questionId,
        },
      },
    })

    if (!answer) return null

    return ExerciseAnswerMapper.toDomain(answer)
  }

  async findManyByListId(exerciseListId: string): Promise<ExerciseAnswer[]> {
    const answers = await this.prisma.exerciseAnswer.findMany({
      where: { exerciseListId },
    })

    return answers.map(ExerciseAnswerMapper.toDomain)
  }

  async countByListId(exerciseListId: string): Promise<number> {
    return this.prisma.exerciseAnswer.count({
      where: { exerciseListId },
    })
  }

  async findAnsweredQuestionIdsByUserId(userId: string): Promise<string[]> {
    const answers = await this.prisma.exerciseAnswer.findMany({
      where: {
        exerciseList: { userId },
      },
      select: { questionId: true },
      distinct: ['questionId'],
    })

    return answers.map((a) => a.questionId)
  }

  async countByUserAndSubjectsInDateRange(
    userId: string,
    subjects: string[],
    startDate: Date,
    endDate: Date,
  ): Promise<Map<string, number>> {
    const result = new Map<string, number>()

    if (subjects.length === 0) return result

    const rows = await this.prisma.$queryRaw<
      { subject: string; count: number }[]
    >`SELECT
        el.question_subject_map ->> ea.question_id AS subject,
        COUNT(*)::int AS count
      FROM exercise_answers ea
      JOIN exercise_lists el ON ea.exercise_list_id = el.id
      WHERE el.user_id = ${userId}
        AND el.status = 'FINISHED'
        AND el.created_at >= ${startDate}
        AND el.created_at <= ${endDate}
        AND el.question_subject_map ->> ea.question_id = ANY(${subjects})
      GROUP BY el.question_subject_map ->> ea.question_id`

    for (const row of rows) {
      result.set(row.subject, row.count)
    }

    return result
  }

  async saveManyIsCorrect(answers: ExerciseAnswer[]): Promise<void> {
    await this.prisma.$transaction(
      answers.map((answer) => {
        const data = ExerciseAnswerMapper.toPrisma(answer)
        return this.prisma.exerciseAnswer.update({
          where: { id: data.id },
          data: { isCorrect: data.isCorrect },
        })
      }),
    )
  }
}
