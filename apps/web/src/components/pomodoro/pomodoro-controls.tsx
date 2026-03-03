'use client'

import { Button } from '@/components/ui/button'
import { Play, Pause, Square, SkipForward } from 'lucide-react'
import { type Phase } from '@/hooks/use-pomodoro-timer'

interface PomodoroControlsProps {
  phase: Phase
  isSaving?: boolean
  onStart: () => void
  onPause: () => void
  onResume: () => void
  onStop: () => void
  onSkip: () => void
}

export function PomodoroControls({
  phase,
  isSaving,
  onStart,
  onPause,
  onResume,
  onStop,
  onSkip,
}: PomodoroControlsProps) {
  const isActive = phase !== 'IDLE'
  const isPaused = phase === 'PAUSED'
  const isWorking = phase === 'WORK' || phase === 'SHORT_BREAK' || phase === 'LONG_BREAK'

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {!isActive && (
        <Button
          size="lg"
          onClick={onStart}
          disabled={isSaving}
          className="gap-2"
        >
          <Play className="size-4" />
          Iniciar
        </Button>
      )}

      {isWorking && (
        <Button
          size="lg"
          variant="outline"
          onClick={onPause}
          disabled={isSaving}
          className="gap-2"
        >
          <Pause className="size-4" />
          Pausar
        </Button>
      )}

      {isPaused && (
        <Button
          size="lg"
          onClick={onResume}
          disabled={isSaving}
          className="gap-2"
        >
          <Play className="size-4" />
          Retomar
        </Button>
      )}

      {isActive && (
        <>
          <Button
            size="lg"
            variant="outline"
            onClick={onSkip}
            disabled={isSaving}
            className="gap-2"
          >
            <SkipForward className="size-4" />
            Pular
          </Button>
          <Button
            size="lg"
            variant="destructive"
            onClick={onStop}
            disabled={isSaving}
            className="gap-2"
          >
            <Square className="size-4" />
            Parar
          </Button>
        </>
      )}
    </div>
  )
}
