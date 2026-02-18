import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { type CreateQuestionDto } from './dto/create-question.dto'
import { type UpdateQuestionDto } from './dto/update-question.dto'
import { type ListQuestionsDto } from './dto/list-questions.dto'
import { type RandomQuestionsDto } from './dto/list-questions.dto'
import { Prisma } from '@/generated/prisma'

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateQuestionDto) {
    return this.prisma.question.create({ data })
  }

  async createMany(data: CreateQuestionDto[]) {
    const result = await this.prisma.question.createMany({
      data,
      skipDuplicates: true,
    })

    return { count: result.count }
  }

  async findAll(params: ListQuestionsDto) {
    const { page, perPage, subject, origin } = params

    const where: Prisma.QuestionWhereInput = {}

    if (subject) {
      where.subject = { equals: subject, mode: 'insensitive' }
    }

    if (origin) {
      where.origin = { contains: origin, mode: 'insensitive' }
    }

    const [questions, total] = await Promise.all([
      this.prisma.question.findMany({
        where,
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.question.count({ where }),
    ])

    return {
      questions,
      meta: {
        total,
        page,
        perPage,
        totalPages: Math.ceil(total / perPage),
      },
    }
  }

  async findById(id: string) {
    const question = await this.prisma.question.findUnique({ where: { id } })

    if (!question) {
      throw new NotFoundException('Questão não encontrada')
    }

    return question
  }

  async findRandom(params: RandomQuestionsDto) {
    const { count, subject, exclude } = params

    const conditions: string[] = []
    const values: unknown[] = []
    let paramIndex = 1

    if (subject) {
      conditions.push(`LOWER(subject) = LOWER($${paramIndex})`)
      values.push(subject)
      paramIndex++
    }

    if (exclude.length > 0) {
      conditions.push(`id NOT IN (${exclude.map(() => `$${paramIndex++}`).join(', ')})`)
      values.push(...exclude)
    }

    const whereClause =
      conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : ''

    values.push(count)

    const questions = await this.prisma.$queryRawUnsafe(
      `SELECT * FROM questions ${whereClause} ORDER BY RANDOM() LIMIT $${paramIndex}`,
      ...values,
    )

    return questions
  }

  async update(id: string, data: UpdateQuestionDto) {
    await this.findById(id)

    return this.prisma.question.update({
      where: { id },
      data,
    })
  }

  async delete(id: string) {
    await this.findById(id)

    await this.prisma.question.delete({ where: { id } })
  }

  async getSubjects() {
    const subjects = await this.prisma.question.findMany({
      select: { subject: true },
      distinct: ['subject'],
      orderBy: { subject: 'asc' },
    })

    return subjects.map((s) => s.subject)
  }

  async getOrigins() {
    const origins = await this.prisma.question.findMany({
      select: { origin: true },
      distinct: ['origin'],
      orderBy: { origin: 'asc' },
    })

    return origins.map((o) => o.origin)
  }

  async findByIds(ids: string[], includeAnswers = false) {
    const select = includeAnswers
      ? undefined
      : {
          id: true,
          externalId: true,
          statement: true,
          imageUrl: true,
          alternatives: true,
          origin: true,
          subject: true,
          categories: true,
          createdAt: true,
          updatedAt: true,
        }

    const questions = await this.prisma.question.findMany({
      where: { id: { in: ids } },
      ...(select ? { select } : {}),
    })

    return questions
  }

  async getAnswer(id: string) {
    const question = await this.prisma.question.findUnique({
      where: { id },
      select: { correctAnswer: true },
    })

    if (!question) {
      throw new NotFoundException('Questão não encontrada')
    }

    return { correctAnswer: question.correctAnswer }
  }

  async getCategories(subject?: string) {
    const where: Prisma.QuestionWhereInput = {}

    if (subject) {
      where.subject = { equals: subject, mode: 'insensitive' }
    }

    const questions = await this.prisma.question.findMany({
      where,
      select: { categories: true },
    })

    const allCategories = questions.flatMap(
      (q) => q.categories as string[],
    )

    return [...new Set(allCategories)].sort()
  }
}
