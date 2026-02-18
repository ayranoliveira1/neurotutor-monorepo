export interface ExerciseListSection {
  subject: string
  origin?: string
  quantity: number
  categories?: string[]
}

export interface ExerciseListItem {
  id: string
  name: string
  shuffleQuestions: boolean
  ignoreAnswered: boolean
  sections: ExerciseListSection[]
  totalQuestions: number
  status: 'PENDING' | 'IN_PROGRESS' | 'FINISHED'
  correctCount: number | null
  totalTimeSeconds: number | null
  avgTimePerQuestion: number | null
  createdAt: string
  updatedAt: string
}

export interface QuestionData {
  id: string
  externalId: string
  statement: string
  imageUrl: string | null
  alternatives: string[]
  origin: string
  subject: string
  categories: string[]
  createdAt: string
  updatedAt: string
}

export interface QuestionWithAnswer extends QuestionData {
  correctAnswer: number
}

export interface ExerciseAnswerData {
  id: string
  exerciseListId: string
  questionId: string
  selectedAnswer: number
  isCorrect: boolean | null
  timeSpentSeconds: number
  createdAt: string
}
