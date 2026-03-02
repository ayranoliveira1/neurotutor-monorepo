'use client'

import { Target, CheckCircle2 } from 'lucide-react'
import type { GoalProgressData } from '@/actions/study-plan/types'

interface GoalProgressCardProps {
  goal: GoalProgressData
}

function getProgressColor(percent: number) {
  if (percent >= 100) return 'bg-green-500'
  if (percent >= 60) return 'bg-blue-500'
  if (percent >= 30) return 'bg-yellow-500'
  return 'bg-red-500'
}

function getAccuracyColor(percent: number) {
  if (percent >= 80) return 'text-green-600 dark:text-green-400'
  if (percent >= 50) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-red-600 dark:text-red-400'
}

export function GoalProgressCard({ goal }: GoalProgressCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-primary" />
          <h4 className="font-semibold">{goal.subject}</h4>
        </div>
        {goal.weeklyProgress >= 100 && (
          <CheckCircle2 className="h-5 w-5 text-green-500" />
        )}
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progresso semanal</span>
            <span className="font-medium">
              {goal.currentWeekAnswered}/{goal.weeklyQuestionsTarget}
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-muted">
            <div
              className={`h-full rounded-full transition-all ${getProgressColor(goal.weeklyProgress)}`}
              style={{ width: `${Math.min(goal.weeklyProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {goal.weeklyProgress}% da meta semanal
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2 border-t text-sm">
          <div>
            <p className="text-muted-foreground text-xs">Total respondidas</p>
            <p className="font-semibold">{goal.totalAnswered}</p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Taxa de acertos</p>
            <p className={`font-semibold ${getAccuracyColor(goal.accuracyPercent)}`}>
              {goal.accuracyPercent}%
            </p>
          </div>
          <div>
            <p className="text-muted-foreground text-xs">Acertos</p>
            <p className="font-semibold">{goal.correctCount}</p>
          </div>
          {goal.targetAccuracyPercent && (
            <div>
              <p className="text-muted-foreground text-xs">Meta de acertos</p>
              <p className="font-semibold">{goal.targetAccuracyPercent}%</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
