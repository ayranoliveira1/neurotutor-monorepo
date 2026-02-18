import {
  QuestionsProvider,
  type QuestionData,
  type QuestionWithAnswer,
  type FindRandomQuestionsParams,
} from '@/domain/application/providers/questions-provider'
import { faker } from '@faker-js/faker'

export class FakeQuestionsProvider implements QuestionsProvider {
  public questions: QuestionWithAnswer[] = []

  addQuestion(override: Partial<QuestionWithAnswer> = {}): QuestionWithAnswer {
    const question: QuestionWithAnswer = {
      id: override.id ?? faker.string.uuid(),
      externalId: override.externalId ?? faker.string.alphanumeric(10),
      statement: override.statement ?? faker.lorem.paragraph(),
      imageUrl: override.imageUrl ?? null,
      alternatives: override.alternatives ?? [
        { text: 'A' },
        { text: 'B' },
        { text: 'C' },
        { text: 'D' },
        { text: 'E' },
      ],
      origin: override.origin ?? 'ENEM 2025',
      subject: override.subject ?? 'Matemática',
      categories: override.categories ?? ['Álgebra'],
      correctAnswer: override.correctAnswer ?? 0,
      createdAt: override.createdAt ?? new Date(),
      updatedAt: override.updatedAt ?? new Date(),
    }

    this.questions.push(question)
    return question
  }

  async findRandomQuestions(
    params: FindRandomQuestionsParams,
  ): Promise<QuestionData[]> {
    let filtered = this.questions.filter(
      (q) => q.subject.toLowerCase() === params.subject.toLowerCase(),
    )

    if (params.exclude?.length) {
      filtered = filtered.filter((q) => !params.exclude!.includes(q.id))
    }

    if (params.origin) {
      filtered = filtered.filter((q) =>
        q.origin.toLowerCase().includes(params.origin!.toLowerCase()),
      )
    }

    if (params.categories?.length) {
      const cats = params.categories.map((c) => c.toLowerCase())
      filtered = filtered.filter((q) =>
        q.categories.some((c) => cats.includes(c.toLowerCase())),
      )
    }

    return filtered.slice(0, params.quantity).map(({ correctAnswer, ...q }) => q)
  }

  async findByIds(
    ids: string[],
    includeAnswers = false,
  ): Promise<QuestionData[] | QuestionWithAnswer[]> {
    const found = this.questions.filter((q) => ids.includes(q.id))

    if (includeAnswers) {
      return found
    }

    return found.map(({ correctAnswer, ...q }) => q)
  }

  async getAnswer(questionId: string): Promise<{ correctAnswer: number }> {
    const question = this.questions.find((q) => q.id === questionId)
    if (!question) throw new Error('Questão não encontrada')
    return { correctAnswer: question.correctAnswer }
  }

  async getSubjects(): Promise<string[]> {
    return [...new Set(this.questions.map((q) => q.subject))].sort()
  }

  async getOrigins(): Promise<string[]> {
    return [...new Set(this.questions.map((q) => q.origin))].sort()
  }

  async getCategories(subject?: string): Promise<string[]> {
    let filtered = this.questions
    if (subject) {
      filtered = filtered.filter(
        (q) => q.subject.toLowerCase() === subject.toLowerCase(),
      )
    }
    const all = filtered.flatMap((q) => q.categories)
    return [...new Set(all)].sort()
  }
}
