'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Pause, Play, Square, Maximize2, Minimize2 } from 'lucide-react'
import { usePomodoroContext } from '@/contexts/pomodoro-context'
import { useDraggable } from '@/hooks/use-draggable'
import { PomodoroTimer } from './pomodoro-timer'

const PHASE_LABELS: Record<string, string> = {
  WORK: 'Foco',
  SHORT_BREAK: 'Pausa',
  LONG_BREAK: 'Pausa Longa',
  PAUSED: 'Pausado',
}

export function PomodoroFloatingPopup() {
  const pathname = usePathname()
  const router = useRouter()
  const {
    state,
    totalSeconds,
    isSaving,
    handlePause,
    handleResume,
    handleStop,
  } = usePomodoroContext()

  const [minimized, setMinimized] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const initialPosition = useMemo(
    () => ({
      x: typeof window !== 'undefined' ? window.innerWidth - 220 : 0,
      y: 16,
    }),
    []
  )

  const { position, handlePointerDown, isDragging } = useDraggable({
    initialPosition,
  })

  const onStop = useCallback(() => {
    void handleStop()
  }, [handleStop])

  const isOnPomodoroPage = pathname === '/pomodoro'
  const isTimerActive = state.phase !== 'IDLE'

  if (!mounted || isOnPomodoroPage || !isTimerActive) return null

  const isPaused = state.phase === 'PAUSED'
  const phaseLabel = PHASE_LABELS[state.phase] ?? ''

  if (minimized) {
    return (
      <div
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          zIndex: 9999,
          touchAction: 'none',
          userSelect: 'none',
        }}
        onPointerDown={handlePointerDown}
        className={`flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
        data-testid="pomodoro-floating-minimized"
      >
        <button
          onClick={() => setMinimized(false)}
          className="flex size-full items-center justify-center"
          aria-label="Expandir timer"
        >
          <Maximize2 className="size-5" />
        </button>
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        zIndex: 9999,
        touchAction: 'none',
        userSelect: 'none',
      }}
      onPointerDown={handlePointerDown}
      className={`w-50 rounded-xl border bg-background p-3 shadow-xl ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
      data-testid="pomodoro-floating-popup"
    >
      {/* Header */}
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          {phaseLabel}
        </span>
        <button
          onClick={() => setMinimized(true)}
          className="rounded p-0.5 text-muted-foreground hover:text-foreground"
          aria-label="Minimizar timer"
        >
          <Minimize2 className="size-3.5" />
        </button>
      </div>

      {/* Timer */}
      <div className="flex justify-center">
        <PomodoroTimer
          secondsLeft={state.secondsLeft}
          totalSeconds={totalSeconds}
          phase={state.phase}
          size="compact"
        />
      </div>

      {/* Controls */}
      <div className="mt-2 flex items-center justify-center gap-1.5">
        {isPaused ? (
          <Button
            size="sm"
            variant="outline"
            onClick={handleResume}
            disabled={isSaving}
            className="h-7 gap-1 px-2 text-xs"
          >
            <Play className="size-3" />
            Retomar
          </Button>
        ) : (
          <Button
            size="sm"
            variant="outline"
            onClick={handlePause}
            disabled={isSaving}
            className="h-7 gap-1 px-2 text-xs"
          >
            <Pause className="size-3" />
            Pausar
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={onStop}
          disabled={isSaving}
          className="h-7 gap-1 px-2 text-xs"
        >
          <Square className="size-3" />
          Parar
        </Button>
      </div>

      {/* Expand button */}
      <button
        onClick={() => router.push('/pomodoro')}
        className="mt-2 w-full text-center text-xs text-muted-foreground hover:text-foreground"
      >
        Expandir
      </button>
    </div>
  )
}
