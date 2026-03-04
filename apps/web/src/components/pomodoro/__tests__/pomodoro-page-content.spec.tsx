import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroPageContent } from '../pomodoro-page-content'
import { DEFAULT_SETTINGS } from '@/hooks/use-pomodoro-timer'

const mockContextValue = {
  state: {
    phase: 'IDLE' as const,
    secondsLeft: 1500,
    pomodorosCompleted: 0,
    cyclesSinceLastLong: 0,
    startedAt: null,
    pausedPhase: null,
    settings: DEFAULT_SETTINGS,
  },
  totalSeconds: 1500,
  isSaving: false,
  handleStart: vi.fn(),
  handlePause: vi.fn(),
  handleResume: vi.fn(),
  handleStop: vi.fn(),
  handleSkip: vi.fn(),
  selectedSound: 'none' as const,
  setSelectedSound: vi.fn(),
  settingsOpen: false,
  setSettingsOpen: vi.fn(),
  settings: DEFAULT_SETTINGS,
  handleSaveSettings: vi.fn(),
  statsLoading: false,
  todayPomodoros: 2,
  weeklyMinutes: 50,
  totalSessions: 3,
  dailyGoal: 8,
}

vi.mock('@/contexts/pomodoro-context', () => ({
  usePomodoroContext: vi.fn(() => mockContextValue),
}))

vi.mock('../pomodoro-timer', () => ({
  PomodoroTimer: () => <div data-testid="pomodoro-timer" />,
}))

vi.mock('../pomodoro-controls', () => ({
  PomodoroControls: () => <div data-testid="pomodoro-controls" />,
}))

vi.mock('../pomodoro-stats-card', () => ({
  PomodoroStatsCard: () => <div data-testid="pomodoro-stats" />,
}))

vi.mock('../pomodoro-cycle-indicator', () => ({
  PomodoroCycleIndicator: () => <div data-testid="cycle-indicator" />,
}))

vi.mock('../pomodoro-sound-selector', () => ({
  PomodoroSoundSelector: () => <div data-testid="sound-selector" />,
}))

vi.mock('../pomodoro-settings-dialog', () => ({
  PomodoroSettingsDialog: () => null,
}))

import { usePomodoroContext } from '@/contexts/pomodoro-context'
const mockUsePomodoroContext = vi.mocked(usePomodoroContext)

function setContext(overrides = {}) {
  const value = { ...mockContextValue, ...overrides }
  mockUsePomodoroContext.mockReturnValue(value)
}

describe('PomodoroPageContent', () => {
  it('deve renderizar timer, controls e stats quando carregado', () => {
    setContext()
    render(<PomodoroPageContent />)
    expect(screen.getByTestId('pomodoro-timer')).toBeInTheDocument()
    expect(screen.getByTestId('pomodoro-controls')).toBeInTheDocument()
    expect(screen.getByTestId('pomodoro-stats')).toBeInTheDocument()
  })

  it('não deve exibir badge de fase quando IDLE', () => {
    setContext()
    render(<PomodoroPageContent />)
    expect(screen.queryByText('Foco')).not.toBeInTheDocument()
    expect(screen.queryByText('Pausa')).not.toBeInTheDocument()
  })

  it('deve exibir badge "Foco" quando phase=WORK', () => {
    setContext({
      state: { ...mockContextValue.state, phase: 'WORK' },
    })
    render(<PomodoroPageContent />)
    expect(screen.getByText('Foco')).toBeInTheDocument()
  })

  it('deve exibir badge "Pausa Longa" quando phase=LONG_BREAK', () => {
    setContext({
      state: { ...mockContextValue.state, phase: 'LONG_BREAK' },
    })
    render(<PomodoroPageContent />)
    expect(screen.getByText('Pausa Longa')).toBeInTheDocument()
  })
})
