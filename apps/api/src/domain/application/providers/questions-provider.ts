export interface QuestionData {
  id: string
  externalId: string
  statement: string
  imageUrl: string | null
  alternatives: unknown
  origin: string
  subject: string
  categories: string[]
  year?: number | null
  difficulty?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface QuestionWithAnswer extends QuestionData {
  correctAnswer: number
}

export interface QuestionsStats {
  total: number
  bySubject: { subject: string; count: number }[]
}

export interface CreateQuestionParams {
  externalId: string
  statement: string
  imageUrl?: string | null
  alternatives: string[]
  origin: string
  subject: string
  categories: string[]
  correctAnswer: number
  year?: number
  difficulty?: string
}

export interface ListQuestionsParams {
  page: number
  perPage: number
  subject?: string
  year?: number
  difficulty?: string
}

export interface QuestionsPagination {
  questions: QuestionWithAnswer[]
  meta: {
    total: number
    page: number
    perPage: number
    totalPages: number
  }
}

export interface UpdateQuestionParams {
  externalId?: string
  statement?: string
  imageUrl?: string | null
  alternatives?: string[]
  origin?: string
  subject?: string
  categories?: string[]
  correctAnswer?: number
  year?: number | null
  difficulty?: string | null
}

export interface FindRandomQuestionsParams {
  subject: string
  origin?: string
  categories?: string[]
  year?: number
  difficulty?: string
  quantity: number
  exclude?: string[]
}

export abstract class QuestionsProvider {
  abstract findRandomQuestions(
    params: FindRandomQuestionsParams
  ): Promise<QuestionData[]>

  abstract findByIds(
    ids: string[],
    includeAnswers?: boolean
  ): Promise<QuestionData[] | QuestionWithAnswer[]>

  abstract getAnswer(questionId: string): Promise<{ correctAnswer: number }>

  abstract getSubjects(): Promise<string[]>

  abstract getOrigins(): Promise<string[]>

  abstract getCategories(subject?: string): Promise<string[]>

  abstract getYears(): Promise<number[]>

  abstract getDifficulties(): Promise<string[]>

  abstract listQuestions(
    params: ListQuestionsParams
  ): Promise<QuestionsPagination>

  abstract getStats(): Promise<QuestionsStats>

  abstract createQuestion(
    params: CreateQuestionParams
  ): Promise<QuestionWithAnswer>

  abstract getQuestionById(id: string): Promise<QuestionWithAnswer | null>

  abstract updateQuestion(
    id: string,
    params: UpdateQuestionParams
  ): Promise<QuestionWithAnswer>

  abstract deleteQuestion(id: string): Promise<void>
}
