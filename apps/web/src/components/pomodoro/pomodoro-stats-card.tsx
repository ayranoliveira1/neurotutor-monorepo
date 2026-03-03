'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Timer, Clock, CheckCircle2, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface PomodoroStatsCardProps {
  todayPomodoros: number
  dailyGoal: number
  weeklyMinutes: number
  totalSessions: number
  loading?: boolean
}

export function PomodoroStatsCard({
  todayPomodoros,
  dailyGoal,
  weeklyMinutes,
  totalSessions,
  loading,
}: PomodoroStatsCardProps) {
  const goalProgress = Math.min(100, (todayPomodoros / dailyGoal) * 100)

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Timer className="size-4" />
            Pomodoros hoje
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {todayPomodoros}
            <span className="text-sm font-normal text-muted-foreground">
              /{dailyGoal}
            </span>
          </p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-muted">
            <div
              className={cn(
                'h-full rounded-full transition-all',
                goalProgress >= 100 ? 'bg-green-500' : 'bg-primary',
              )}
              style={{ width: `${goalProgress}%` }}
              role="progressbar"
              aria-valuenow={todayPomodoros}
              aria-valuemax={dailyGoal}
              aria-label="Progresso da meta diária"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Clock className="size-4" />
            Minutos esta semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{weeklyMinutes}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <CheckCircle2 className="size-4" />
            Sessões concluídas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">{totalSessions}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <Target className="size-4" />
            Meta diária
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-bold">
            {goalProgress >= 100 ? '✓' : `${Math.round(goalProgress)}%`}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
