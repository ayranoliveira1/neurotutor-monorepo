'use client'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Settings } from 'lucide-react'
import { usePomodoroPage } from '@/hooks/use-pomodoro-page'
import { PomodoroTimer } from './pomodoro-timer'
import { PomodoroControls } from './pomodoro-controls'
import { PomodoroCycleIndicator } from './pomodoro-cycle-indicator'
import { PomodoroSoundSelector } from './pomodoro-sound-selector'
import { PomodoroSettingsDialog } from './pomodoro-settings-dialog'
import { PomodoroStatsCard } from './pomodoro-stats-card'

const PHASE_BADGE_LABELS = {
  IDLE: null,
  WORK: 'Foco',
  SHORT_BREAK: 'Pausa',
  LONG_BREAK: 'Pausa Longa',
  PAUSED: 'Pausado',
} as const

const PHASE_BADGE_VARIANTS = {
  IDLE: 'secondary',
  WORK: 'default',
  SHORT_BREAK: 'secondary',
  LONG_BREAK: 'secondary',
  PAUSED: 'outline',
} as const

export function PomodoroPageContent() {
  const {
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
    settingsOpen,
    setSettingsOpen,
    settings,
    handleSaveSettings,
    statsLoading,
    todayPomodoros,
    weeklyMinutes,
    totalSessions,
    dailyGoal,
  } = usePomodoroPage()

  const phaseBadge = PHASE_BADGE_LABELS[state.phase]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold">Modo Foco</h1>
          {phaseBadge && (
            <Badge variant={PHASE_BADGE_VARIANTS[state.phase]}>
              {phaseBadge}
            </Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSettingsOpen(true)}
          className="gap-2"
        >
          <Settings className="size-4" />
          <span className="hidden sm:inline">Configurações</span>
        </Button>
      </div>

      {/* Stats */}
      <PomodoroStatsCard
        todayPomodoros={todayPomodoros}
        dailyGoal={dailyGoal}
        weeklyMinutes={weeklyMinutes}
        totalSessions={totalSessions}
        loading={statsLoading}
      />

      {/* Timer */}
      <Card>
        <CardContent className="flex flex-col items-center gap-6 py-8">
          <PomodoroTimer
            secondsLeft={state.secondsLeft}
            totalSeconds={totalSeconds}
            phase={state.phase}
          />

          <PomodoroCycleIndicator
            pomodorosCompleted={state.pomodorosCompleted}
            cyclesBeforeLong={state.settings.cyclesBeforeLong}
            cyclesSinceLastLong={state.cyclesSinceLastLong}
          />

          <PomodoroControls
            phase={state.phase}
            isSaving={isSaving}
            onStart={handleStart}
            onPause={handlePause}
            onResume={handleResume}
            onStop={handleStop}
            onSkip={handleSkip}
          />

          <PomodoroSoundSelector
            selected={selectedSound}
            onSelect={setSelectedSound}
          />
        </CardContent>
      </Card>

      {/* Settings Dialog — key resets internal state each time the dialog opens */}
      <PomodoroSettingsDialog
        key={settingsOpen ? 'open' : 'closed'}
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        settings={settings}
        onSave={handleSaveSettings}
      />
    </div>
  )
}
