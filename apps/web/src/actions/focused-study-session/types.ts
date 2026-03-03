export interface FocusedStudySessionItem {
  id: string
  userId: string
  status: 'COMPLETED' | 'ABANDONED'
  pomodoroIntervalMins: number
  breakDurationMins: number
  pomodorosCompleted: number
  totalTimeSpentSeconds: number
  startedAt: string
  completedAt: string
  createdAt: string
  updatedAt: string
}

export interface FocusedStudySessionsStats {
  totalSessions: number
  totalPomodoros: number
  totalTimeSeconds: number
  sessionsByDay: { date: string; count: number; pomodoros: number }[]
}

export interface SaveFocusedStudySessionInput {
  status: 'COMPLETED' | 'ABANDONED'
  pomodoroIntervalMins: number
  breakDurationMins: number
  pomodorosCompleted: number
  totalTimeSpentSeconds: number
  startedAt: Date
  completedAt: Date
}

export interface FetchFocusedStudySessionsResponse {
  sessions: FocusedStudySessionItem[]
  totalItems: number
  totalPages: number
  currentPage: number
}
