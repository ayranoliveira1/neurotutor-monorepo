'use client'

import { BookOpen, Target, Calendar, TrendingUp } from 'lucide-react'
import type { OverallProgressData } from '@/actions/study-plan/types'

interface OverallProgressCardProps {
  overall: OverallProgressData
}

export function OverallProgressCard({ overall }: OverallProgressCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <h3 className="font-semibold mb-4">Visão Geral</h3>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-3">
          <BookOpen className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">{overall.totalQuestions}</span>
          <span className="text-xs text-muted-foreground text-center">
            Questões respondidas
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-3">
          <TrendingUp className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">{overall.avgAccuracy}%</span>
          <span className="text-xs text-muted-foreground text-center">
            Taxa de acertos média
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-3">
          <Calendar className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">{overall.daysRemaining}</span>
          <span className="text-xs text-muted-foreground text-center">
            Dias restantes
          </span>
        </div>

        <div className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-3">
          <Target className="h-5 w-5 text-primary" />
          <span className="text-2xl font-bold">{overall.daysElapsed}</span>
          <span className="text-xs text-muted-foreground text-center">
            Dias decorridos
          </span>
        </div>
      </div>
    </div>
  )
}
