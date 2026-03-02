export interface StudyPlanGoalItem {
  id: string
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent: number | null
  createdAt: string
  updatedAt: string
}

export interface StudyPlanItem {
  id: string
  name: string
  description: string | null
  status: 'ACTIVE' | 'COMPLETED' | 'ARCHIVED'
  startDate: string
  endDate: string
  goals: StudyPlanGoalItem[]
  createdAt: string
  updatedAt: string
}

export interface GoalProgressData {
  goalId: string
  subject: string
  weeklyQuestionsTarget: number
  targetAccuracyPercent: number | null
  currentWeekAnswered: number
  totalAnswered: number
  correctCount: number
  accuracyPercent: number
  weeklyProgress: number
}

export interface OverallProgressData {
  totalQuestions: number
  totalCorrect: number
  avgAccuracy: number
  daysRemaining: number
  daysElapsed: number
  totalDays: number
}

export interface StudyPlanProgressResponse {
  studyPlan: StudyPlanItem
  goalsProgress: GoalProgressData[]
  overall: OverallProgressData
}
