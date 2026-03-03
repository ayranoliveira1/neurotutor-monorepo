'use client'

import { useReducer, useEffect, useRef, useCallback, useState } from 'react'
import { toast } from 'sonner'
import { saveFocusedStudySessionAction } from '@/actions/focused-study-session/save-focused-study-session'
import { useNavigationGuard } from '@/contexts/navigation-guard-context'

export type Phase = 'IDLE' | 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK' | 'PAUSED'

export interface PomodoroSettings {
  workMins: number
  shortBreakMins: number
  longBreakMins: number
  cyclesBeforeLong: number
  dailyGoal: number
}

export const DEFAULT_SETTINGS: PomodoroSettings = {
  workMins: 25,
  shortBreakMins: 5,
  longBreakMins: 15,
  cyclesBeforeLong: 4,
  dailyGoal: 8,
}

export interface PomodoroState {
  phase: Phase
  secondsLeft: number
  pomodorosCompleted: number
  cyclesSinceLastLong: number
  startedAt: Date | null
  pausedPhase: Phase | null
  settings: PomodoroSettings
}

type PomodoroAction =
  | { type: 'START' }
  | { type: 'PAUSE' }
  | { type: 'RESUME' }
  | { type: 'SKIP' }
  | { type: 'STOP' }
  | { type: 'TICK' }
  | { type: 'UPDATE_SETTINGS'; payload: PomodoroSettings }

function getNextPhase(
  current: 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK',
  cyclesSinceLastLong: number,
  cyclesBeforeLong: number,
): Phase {
  if (current === 'WORK') {
    const nextCycles = cyclesSinceLastLong + 1
    return nextCycles >= cyclesBeforeLong ? 'LONG_BREAK' : 'SHORT_BREAK'
  }
  return 'WORK'
}

function phaseSeconds(phase: Phase, settings: PomodoroSettings): number {
  switch (phase) {
    case 'WORK':
      return settings.workMins * 60
    case 'SHORT_BREAK':
      return settings.shortBreakMins * 60
    case 'LONG_BREAK':
      return settings.longBreakMins * 60
    default:
      return settings.workMins * 60
  }
}

export function pomodoroReducer(
  state: PomodoroState,
  action: PomodoroAction,
): PomodoroState {
  switch (action.type) {
    case 'START': {
      return {
        ...state,
        phase: 'WORK',
        secondsLeft: state.settings.workMins * 60,
        pomodorosCompleted: 0,
        cyclesSinceLastLong: 0,
        startedAt: new Date(),
        pausedPhase: null,
      }
    }

    case 'PAUSE': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      return {
        ...state,
        pausedPhase: state.phase,
        phase: 'PAUSED',
      }
    }

    case 'RESUME': {
      if (state.phase !== 'PAUSED' || !state.pausedPhase) return state
      return {
        ...state,
        phase: state.pausedPhase,
        pausedPhase: null,
      }
    }

    case 'SKIP': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      const activePhase = state.phase as 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
      const newPomodoros =
        activePhase === 'WORK'
          ? state.pomodorosCompleted + 1
          : state.pomodorosCompleted
      // Only increment when completing WORK; only reset when completing LONG_BREAK
      const newCycles =
        activePhase === 'WORK'
          ? state.cyclesSinceLastLong + 1
          : activePhase === 'LONG_BREAK'
            ? 0
            : state.cyclesSinceLastLong
      const nextPhase = getNextPhase(
        activePhase,
        state.cyclesSinceLastLong,
        state.settings.cyclesBeforeLong,
      )
      return {
        ...state,
        phase: nextPhase,
        secondsLeft: phaseSeconds(nextPhase, state.settings),
        pomodorosCompleted: newPomodoros,
        cyclesSinceLastLong:
          nextPhase === 'WORK' ? newCycles % state.settings.cyclesBeforeLong : newCycles,
      }
    }

    case 'STOP': {
      return {
        ...state,
        phase: 'IDLE',
        secondsLeft: state.settings.workMins * 60,
        pomodorosCompleted: 0,
        cyclesSinceLastLong: 0,
        startedAt: null,
        pausedPhase: null,
      }
    }

    case 'TICK': {
      if (state.phase === 'IDLE' || state.phase === 'PAUSED') return state
      if (state.secondsLeft > 0) {
        return { ...state, secondsLeft: state.secondsLeft - 1 }
      }
      // Phase complete — advance to next
      const activePhase = state.phase as 'WORK' | 'SHORT_BREAK' | 'LONG_BREAK'
      const newPomodoros =
        activePhase === 'WORK'
          ? state.pomodorosCompleted + 1
          : state.pomodorosCompleted
      // Only increment when WORK completes; only reset when LONG_BREAK completes
      const newCycles =
        activePhase === 'WORK'
          ? state.cyclesSinceLastLong + 1
          : activePhase === 'LONG_BREAK'
            ? 0
            : state.cyclesSinceLastLong
      const nextPhase = getNextPhase(
        activePhase,
        state.cyclesSinceLastLong,
        state.settings.cyclesBeforeLong,
      )
      const nextCycles =
        nextPhase === 'WORK' ? newCycles % state.settings.cyclesBeforeLong : newCycles
      return {
        ...state,
        phase: nextPhase,
        secondsLeft: phaseSeconds(nextPhase, state.settings),
        pomodorosCompleted: newPomodoros,
        cyclesSinceLastLong: nextCycles,
      }
    }

    case 'UPDATE_SETTINGS': {
      const newSettings = action.payload
      return {
        ...state,
        settings: newSettings,
        secondsLeft:
          state.phase === 'IDLE'
            ? newSettings.workMins * 60
            : state.secondsLeft,
      }
    }

    default:
      return state
  }
}

function buildInitialState(settings: PomodoroSettings): PomodoroState {
  return {
    phase: 'IDLE',
    secondsLeft: settings.workMins * 60,
    pomodorosCompleted: 0,
    cyclesSinceLastLong: 0,
    startedAt: null,
    pausedPhase: null,
    settings,
  }
}

export function usePomodoroTimer(
  initialSettings?: PomodoroSettings,
  onSessionSaved?: () => void,
) {
  const settings = initialSettings ?? DEFAULT_SETTINGS
  const [state, dispatch] = useReducer(
    pomodoroReducer,
    settings,
    buildInitialState,
  )
  const [isSaving, setIsSaving] = useState(false)
  const { setBlocked } = useNavigationGuard()

  const workPhaseStartedAtRef = useRef<Date | null>(null)
  const prevPhaseRef = useRef<Phase>('IDLE')
  const prevPomodorosRef = useRef(0)

  // Block navigation when active
  useEffect(() => {
    if (state.phase === 'IDLE') return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.phase])

  // Sync navigation guard with phase
  useEffect(() => {
    setBlocked(state.phase !== 'IDLE')
  }, [state.phase, setBlocked])

  // Tick interval
  useEffect(() => {
    if (state.phase === 'IDLE' || state.phase === 'PAUSED') return

    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.phase])

  const saveWorkBlock = useCallback(
    async (status: 'COMPLETED' | 'ABANDONED', workStart: Date) => {
      const now = new Date()
      const elapsed = Math.floor((now.getTime() - workStart.getTime()) / 1000)
      if (elapsed <= 0) return
      setIsSaving(true)
      try {
        await saveFocusedStudySessionAction({
          status,
          pomodoroIntervalMins: state.settings.workMins,
          breakDurationMins: state.settings.shortBreakMins,
          pomodorosCompleted: status === 'COMPLETED' ? 1 : 0,
          totalTimeSpentSeconds: elapsed,
          startedAt: workStart,
          completedAt: now,
        })
        onSessionSaved?.()
      } catch {
        toast.error('Não foi possível salvar a sessão. Verifique sua conexão.')
      } finally {
        setIsSaving(false)
      }
    },
    [state.settings, onSessionSaved],
  )

  // Track start of each WORK phase
  useEffect(() => {
    const prev = prevPhaseRef.current
    const curr = state.phase
    prevPhaseRef.current = curr

    if (curr === 'WORK' && prev !== 'PAUSED') {
      workPhaseStartedAtRef.current = new Date()
      if (prev === 'IDLE') {
        prevPomodorosRef.current = 0
      }
    }
    if (curr === 'IDLE') {
      workPhaseStartedAtRef.current = null
    }
  }, [state.phase])

  // Auto-save when a WORK cycle completes
  useEffect(() => {
    const curr = state.pomodorosCompleted
    const prev = prevPomodorosRef.current
    if (curr > prev) {
      prevPomodorosRef.current = curr
      const workStart = workPhaseStartedAtRef.current
      if (workStart) saveWorkBlock('COMPLETED', workStart)
    }
  }, [state.pomodorosCompleted, saveWorkBlock])

  const handleStart = useCallback(() => dispatch({ type: 'START' }), [])
  const handlePause = useCallback(() => dispatch({ type: 'PAUSE' }), [])
  const handleResume = useCallback(() => dispatch({ type: 'RESUME' }), [])
  const handleSkip = useCallback(() => dispatch({ type: 'SKIP' }), [])
  const handleStop = useCallback(async () => {
    if (state.phase === 'WORK') {
      const workStart = workPhaseStartedAtRef.current
      if (workStart) await saveWorkBlock('ABANDONED', workStart)
    }
    dispatch({ type: 'STOP' })
  }, [state.phase, saveWorkBlock])
  const updateSettings = useCallback(
    (s: PomodoroSettings) => dispatch({ type: 'UPDATE_SETTINGS', payload: s }),
    [],
  )

  const totalSeconds = phaseSeconds(
    state.phase === 'PAUSED'
      ? (state.pausedPhase ?? 'WORK')
      : state.phase === 'IDLE'
        ? 'WORK'
        : state.phase,
    state.settings,
  )

  return {
    state,
    dispatch,
    totalSeconds,
    isSaving,
    handleStart,
    handlePause,
    handleResume,
    handleSkip,
    handleStop,
    updateSettings,
  }
}
