'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
  useReducer,
  useEffect,
  useRef,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import {
  pomodoroReducer,
  phaseSeconds,
  DEFAULT_SETTINGS,
  type PomodoroSettings,
  type PomodoroState,
  type Phase,
} from '@/hooks/use-pomodoro-timer'
import { usePomodoroSound, type AmbientSound } from '@/hooks/use-pomodoro-sound'
import { useFocusedStudySessionsStatsQuery } from '@/hooks/use-focused-study-sessions-query'
import { saveFocusedStudySessionAction } from '@/actions/focused-study-session/save-focused-study-session'

function getStoredSettings(): PomodoroSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS
  try {
    const stored = localStorage.getItem('pomodoro-settings')
    if (stored) return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) }
  } catch {
    // ignore
  }
  return DEFAULT_SETTINGS
}

function saveSettingsToStorage(settings: PomodoroSettings) {
  try {
    localStorage.setItem('pomodoro-settings', JSON.stringify(settings))
  } catch {
    // ignore
  }
}

function getWeekRange() {
  const now = new Date()
  const startDate = new Date(now)
  startDate.setDate(now.getDate() - now.getDay())
  startDate.setHours(0, 0, 0, 0)
  const endDate = new Date(startDate)
  endDate.setDate(startDate.getDate() + 6)
  endDate.setHours(23, 59, 59, 999)
  return { startDate, endDate }
}

interface PomodoroContextValue {
  state: PomodoroState
  totalSeconds: number
  isSaving: boolean
  handleStart: () => void
  handlePause: () => void
  handleResume: () => void
  handleStop: () => Promise<void>
  handleSkip: () => void
  selectedSound: AmbientSound
  setSelectedSound: (s: AmbientSound) => void
  settings: PomodoroSettings
  settingsOpen: boolean
  setSettingsOpen: (v: boolean) => void
  handleSaveSettings: (s: PomodoroSettings) => void
  statsLoading: boolean
  todayPomodoros: number
  weeklyMinutes: number
  totalSessions: number
  dailyGoal: number
}

const PomodoroContext = createContext<PomodoroContextValue | null>(null)

export function PomodoroProvider({ children }: { children: React.ReactNode }) {
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('none')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettingsState] =
    useState<PomodoroSettings>(getStoredSettings)
  const [isSaving, setIsSaving] = useState(false)

  const queryClient = useQueryClient()
  const weekRange = useMemo(() => getWeekRange(), [])

  const statsQuery = useFocusedStudySessionsStatsQuery({
    startDate: weekRange.startDate,
    endDate: weekRange.endDate,
  })

  const [state, dispatch] = useReducer(
    pomodoroReducer,
    settings,
    (s: PomodoroSettings) => ({
      phase: 'IDLE' as const,
      secondsLeft: s.workMins * 60,
      pomodorosCompleted: 0,
      cyclesSinceLastLong: 0,
      startedAt: null,
      pausedPhase: null,
      settings: s,
    })
  )

  const workPhaseStartedAtRef = useRef<Date | null>(null)
  const prevPhaseRef = useRef<Phase>('IDLE')
  const prevPomodorosRef = useRef(0)

  const sound = usePomodoroSound(selectedSound)

  // beforeunload protection
  useEffect(() => {
    if (state.phase === 'IDLE') return

    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ''
    }

    window.addEventListener('beforeunload', handler)
    return () => window.removeEventListener('beforeunload', handler)
  }, [state.phase])

  // Tick interval
  useEffect(() => {
    if (state.phase === 'IDLE' || state.phase === 'PAUSED') return

    const id = setInterval(() => dispatch({ type: 'TICK' }), 1000)
    return () => clearInterval(id)
  }, [state.phase])

  const onSessionSaved = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['focused-study-sessions'] })
  }, [queryClient])

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
        onSessionSaved()
      } catch {
        toast.error('Não foi possível salvar a sessão. Verifique sua conexão.')
      } finally {
        setIsSaving(false)
      }
    },
    [state.settings, onSessionSaved]
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

  const handleStart = useCallback(() => {
    dispatch({ type: 'START' })
    sound.play()
  }, [sound])

  const handlePause = useCallback(() => {
    dispatch({ type: 'PAUSE' })
    sound.pause()
  }, [sound])

  const handleResume = useCallback(() => {
    dispatch({ type: 'RESUME' })
    sound.play()
  }, [sound])

  const handleStop = useCallback(async () => {
    if (state.phase === 'WORK') {
      const workStart = workPhaseStartedAtRef.current
      if (workStart) await saveWorkBlock('ABANDONED', workStart)
    }
    dispatch({ type: 'STOP' })
    sound.pause()
  }, [state.phase, saveWorkBlock, sound])

  const handleSkip = useCallback(() => {
    dispatch({ type: 'SKIP' })
    sound.playTransitionBeep()
  }, [sound])

  const handleSaveSettings = useCallback((newSettings: PomodoroSettings) => {
    saveSettingsToStorage(newSettings)
    setSettingsState(newSettings)
    dispatch({ type: 'UPDATE_SETTINGS', payload: newSettings })
    setSettingsOpen(false)
  }, [])

  const totalSeconds = phaseSeconds(
    state.phase === 'PAUSED'
      ? (state.pausedPhase ?? 'WORK')
      : state.phase === 'IDLE'
        ? 'WORK'
        : state.phase,
    state.settings
  )

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), [])
  const todayStats = statsQuery.data?.sessionsByDay.find(
    (d) => d.date === todayStr
  )
  const todayPomodoros = todayStats?.pomodoros ?? 0
  const weeklyMinutes = Math.round(
    (statsQuery.data?.totalTimeSeconds ?? 0) / 60
  )
  const totalSessions = statsQuery.data?.totalSessions ?? 0

  const value = useMemo<PomodoroContextValue>(
    () => ({
      state,
      totalSeconds,
      isSaving,
      handleStart,
      handlePause,
      handleResume,
      handleStop,
      handleSkip,
      selectedSound,
      setSelectedSound,
      settings,
      settingsOpen,
      setSettingsOpen,
      handleSaveSettings,
      statsLoading: statsQuery.isLoading,
      todayPomodoros,
      weeklyMinutes,
      totalSessions,
      dailyGoal: settings.dailyGoal,
    }),
    [
      state,
      totalSeconds,
      isSaving,
      handleStart,
      handlePause,
      handleResume,
      handleStop,
      handleSkip,
      selectedSound,
      settings,
      settingsOpen,
      handleSaveSettings,
      statsQuery.isLoading,
      todayPomodoros,
      weeklyMinutes,
      totalSessions,
    ]
  )

  return (
    <PomodoroContext.Provider value={value}>
      {children}
    </PomodoroContext.Provider>
  )
}

export function usePomodoroContext() {
  const ctx = useContext(PomodoroContext)
  if (!ctx) {
    throw new Error(
      'usePomodoroContext deve ser usado dentro de PomodoroProvider'
    )
  }
  return ctx
}
