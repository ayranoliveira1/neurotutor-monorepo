'use client'

import { type Phase } from '@/hooks/use-pomodoro-timer'

interface PomodoroTimerProps {
  secondsLeft: number
  totalSeconds: number
  phase: Phase
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

const RADIUS = 90
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function PomodoroTimer({
  secondsLeft,
  totalSeconds,
  phase,
}: PomodoroTimerProps) {
  const progress = totalSeconds > 0 ? secondsLeft / totalSeconds : 1
  const dashOffset = CIRCUMFERENCE * (1 - progress)

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-sm font-medium text-muted-foreground">
        {PHASE_LABELS[phase]}
      </p>
      <div className="relative inline-flex items-center justify-center">
        <svg
          width="220"
          height="220"
          viewBox="0 0 220 220"
          aria-label="Timer circular"
        >
          {/* Track */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            className="stroke-muted"
          />
          {/* Progress */}
          <circle
            cx="110"
            cy="110"
            r={RADIUS}
            fill="none"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
            transform="rotate(-90 110 110)"
            className={`transition-all duration-1000 ${PHASE_COLORS[phase]}`}
          />
        </svg>
        <span className="absolute font-mono text-4xl font-bold tabular-nums">
          {formatTime(secondsLeft)}
        </span>
      </div>
    </div>
  )
}
