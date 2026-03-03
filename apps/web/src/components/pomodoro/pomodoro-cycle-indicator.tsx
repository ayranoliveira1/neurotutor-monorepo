'use client'

import { cn } from '@/lib/utils'

interface PomodoroCycleIndicatorProps {
  pomodorosCompleted: number
  cyclesBeforeLong: number
  cyclesSinceLastLong: number
}

export function PomodoroCycleIndicator({
  pomodorosCompleted,
  cyclesBeforeLong,
  cyclesSinceLastLong,
}: PomodoroCycleIndicatorProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-xs text-muted-foreground">
        Pomodoros concluídos: {pomodorosCompleted}
      </p>
      <div className="flex gap-2">
        {Array.from({ length: cyclesBeforeLong }).map((_, i) => (
          <div
            key={i}
            className={cn(
              'size-3 rounded-full transition-colors',
              i < cyclesSinceLastLong
                ? 'bg-primary'
                : 'bg-muted border border-muted-foreground/30',
            )}
            aria-label={
              i < cyclesSinceLastLong ? 'ciclo completo' : 'ciclo pendente'
            }
          />
        ))}
      </div>
    </div>
  )
}
