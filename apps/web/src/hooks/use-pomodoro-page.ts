'use client'

import { useState, useCallback, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { usePomodoroTimer, DEFAULT_SETTINGS, type PomodoroSettings } from './use-pomodoro-timer'
import { usePomodoroSound, type AmbientSound } from './use-pomodoro-sound'
import { useFocusedStudySessionsStatsQuery } from './use-focused-study-sessions-query'

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

export function usePomodoroPage() {
  const [selectedSound, setSelectedSound] = useState<AmbientSound>('none')
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [settings, setSettingsState] = useState<PomodoroSettings>(getStoredSettings)

  const queryClient = useQueryClient()

  // Memoize to avoid creating new Date objects every render (would cause
  // infinite refetches since TanStack Query compares queryKey by reference)
  const weekRange = useMemo(() => getWeekRange(), [])

  const statsQuery = useFocusedStudySessionsStatsQuery({
    startDate: weekRange.startDate,
    endDate: weekRange.endDate,
  })

  const timer = usePomodoroTimer(settings, () => {
    queryClient.invalidateQueries({ queryKey: ['focused-study-sessions'] })
  })
  const sound = usePomodoroSound(selectedSound)

  const handleStart = useCallback(() => {
    timer.handleStart()
    sound.play()
  }, [timer, sound])

  const handlePause = useCallback(() => {
    timer.handlePause()
    sound.pause()
  }, [timer, sound])

  const handleResume = useCallback(() => {
    timer.handleResume()
    sound.play()
  }, [timer, sound])

  const handleStop = useCallback(async () => {
    await timer.handleStop()
    sound.pause()
  }, [timer, sound])

  const handleSkip = useCallback(() => {
    timer.handleSkip()
    sound.playTransitionBeep()
  }, [timer, sound])

  const handleSaveSettings = useCallback(
    (newSettings: PomodoroSettings) => {
      saveSettingsToStorage(newSettings)
      setSettingsState(newSettings)
      timer.updateSettings(newSettings)
      setSettingsOpen(false)
    },
    [timer],
  )

  const todayStr = new Date().toISOString().slice(0, 10)
  const todayStats = statsQuery.data?.sessionsByDay.find((d) => d.date === todayStr)

  const todayPomodoros = todayStats?.pomodoros ?? 0
  const weeklyMinutes = Math.round(
    (statsQuery.data?.totalTimeSeconds ?? 0) / 60,
  )
  const totalSessions = statsQuery.data?.totalSessions ?? 0

  return {
    state: timer.state,
    totalSeconds: timer.totalSeconds,
    isSaving: timer.isSaving,
    handleStart,
    handlePause,
    handleResume,
    handleStop,
    handleSkip,
    selectedSound,
    setSelectedSound,
    settingsOpen,
    setSettingsOpen,
    settings,
    handleSaveSettings,
    statsLoading: statsQuery.isLoading,
    todayPomodoros,
    weeklyMinutes,
    totalSessions,
    dailyGoal: settings.dailyGoal,
  }
}
