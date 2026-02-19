import { Injectable } from '@nestjs/common'
import axios from 'axios'
import { EnvService } from '@/infra/env/env.service'
import {
  QuestionsProvider,
  type QuestionData,
  type QuestionWithAnswer,
  type FindRandomQuestionsParams,
} from '@/domain/application/providers/questions-provider'

@Injectable()
export class HttpQuestionsProvider implements QuestionsProvider {
  private baseUrl: string
  private apiKey: string

  constructor(private envService: EnvService) {
    this.baseUrl = this.envService.get('QUESTIONS_API_URL')
    this.apiKey = this.envService.get('QUESTIONS_API_KEY')
  }

  private get headers() {
    return this.apiKey ? { 'X-API-Key': this.apiKey } : {}
  }

  async findRandomQuestions(
    params: FindRandomQuestionsParams,
  ): Promise<QuestionData[]> {
    const { data } = await axios.get(`${this.baseUrl}/questions/random`, {
      headers: this.headers,
      params: {
        count: params.quantity,
        subject: params.subject,
        year: params.year,
        difficulty: params.difficulty,
        exclude: params.exclude,
      },
    })

    const questions = data as QuestionData[]

    if (params.origin) {
      return questions.filter((q) =>
        q.origin.toLowerCase().includes(params.origin!.toLowerCase()),
      )
    }

    if (params.categories?.length) {
      const cats = params.categories.map((c) => c.toLowerCase())
      return questions.filter((q) =>
        q.categories.some((c) => cats.includes(c.toLowerCase())),
      )
    }

    return questions
  }

  async findByIds(
    ids: string[],
    includeAnswers = false,
  ): Promise<QuestionData[] | QuestionWithAnswer[]> {
    const { data } = await axios.post(
      `${this.baseUrl}/questions/by-ids`,
      { ids, includeAnswers },
      { headers: this.headers },
    )

    return data
  }

  async getAnswer(questionId: string): Promise<{ correctAnswer: number }> {
    const { data } = await axios.get(
      `${this.baseUrl}/questions/${questionId}/answer`,
      { headers: this.headers },
    )

    return data
  }

  async getSubjects(): Promise<string[]> {
    const { data } = await axios.get(`${this.baseUrl}/questions/subjects`, {
      headers: this.headers,
    })
    return data
  }

  async getOrigins(): Promise<string[]> {
    const { data } = await axios.get(`${this.baseUrl}/questions/origins`, {
      headers: this.headers,
    })
    return data
  }

  async getCategories(subject?: string): Promise<string[]> {
    const { data } = await axios.get(`${this.baseUrl}/questions/categories`, {
      headers: this.headers,
      params: subject ? { subject } : {},
    })
    return data
  }

  async getYears(): Promise<number[]> {
    const { data } = await axios.get(`${this.baseUrl}/questions/years`, {
      headers: this.headers,
    })
    return data
  }

  async getDifficulties(): Promise<string[]> {
    const { data } = await axios.get(
      `${this.baseUrl}/questions/difficulties`,
      { headers: this.headers },
    )
    return data
  }
}
