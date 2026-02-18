export interface QuestionData {
  id: string
  externalId: string
  statement: string
  imageUrl: string | null
  alternatives: unknown
  origin: string
  subject: string
  categories: string[]
  createdAt: Date
  updatedAt: Date
}

export interface QuestionWithAnswer extends QuestionData {
  correctAnswer: number
}

export interface FindRandomQuestionsParams {
  subject: string
  origin?: string
  categories?: string[]
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
}
