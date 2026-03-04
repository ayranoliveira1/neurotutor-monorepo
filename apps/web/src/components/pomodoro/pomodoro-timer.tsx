'use client'

import { type Phase } from '@/hooks/use-pomodoro-timer'

interface PomodoroTimerProps {
  secondsLeft: number
  totalSeconds: number
  phase: Phase
  size?: 'default' | 'compact'
}

const PHASE_LABELS: Record<Phase, string> = {
  IDLE: 'Pronto',
  WORK: 'Foco',
  SHORT_BREAK: 'Pausa Curta',
  LONG_BREAK: 'Pausa Longa',
  PAUSED: 'Pausado',
}

const PHASE_COLORS: Record<Phase, string> = {
  IDLE: 'stroke-muted-foreground',
  WORK: 'stroke-primary',
  SHORT_BREAK: 'stroke-green-500',
  LONG_BREAK: 'stroke-blue-500',
  PAUSED: 'stroke-muted-foreground',
}

const SIZE_CONFIG = {
  default: { svgSize: 220, radius: 90, strokeWidth: 10, center: 110 },
  compact: { svgSize: 100, radius: 40, strokeWidth: 6, center: 50 },
} as const

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PomodoroTimer({
  secondsLeft,
  totalSeconds,
  phase,
  size = 'default',
}: PomodoroTimerProps) {
  const { svgSize, radius, strokeWidth, center } = SIZE_CONFIG[size]
  const circumference = 2 * Math.PI * radius
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const dashOffset = circumference * (1 - progress)

  const isCompact = size === 'compact'

  return (
    <div className="flex flex-col items-center gap-2">
      {!isCompact && (
        <p className="text-sm font-medium text-muted-foreground">
          {PHASE_LABELS[phase]}
        </p>
      )}
      <div className="relative inline-flex items-center justify-center">
        <svg
          width={svgSize}
          height={svgSize}
          viewBox={`0 0 ${svgSize} ${svgSize}`}
          aria-label="Timer circular"
        >
          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            className="stroke-muted"
          />

          <circle
            cx={center}
            cy={center}
            r={radius}
            fill="none"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${center} ${center})`}
            className={`transition-all duration-1000 ${PHASE_COLORS[phase]}`}
          />
        </svg>

        <span
          className={`absolute font-mono font-bold tabular-nums ${isCompact ? 'text-lg' : 'text-4xl'}`}
        >
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  )
}
