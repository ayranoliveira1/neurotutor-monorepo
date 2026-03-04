import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PomodoroFloatingPopup } from '../pomodoro-floating-popup'
import { DEFAULT_SETTINGS } from '@/hooks/use-pomodoro-timer'

const mockPush = vi.fn()
let mockPathname = '/'

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname,
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('../pomodoro-timer', () => ({
  PomodoroTimer: () => <div data-testid="pomodoro-timer" />,
}))

const mockContext = {
  state: {
    phase: 'WORK' as const,
    secondsLeft: 1200,
    pomodorosCompleted: 0,
    cyclesSinceLastLong: 0,
    startedAt: new Date(),
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
  todayPomodoros: 0,
  weeklyMinutes: 0,
  totalSessions: 0,
  dailyGoal: 8,
}

vi.mock('@/contexts/pomodoro-context', () => ({
  usePomodoroContext: vi.fn(() => mockContext),
}))

vi.mock('@/hooks/use-draggable', () => ({
  useDraggable: () => ({
    position: { x: 100, y: 100 },
    handlePointerDown: vi.fn(),
    isDragging: false,
  }),
}))

import { usePomodoroContext } from '@/contexts/pomodoro-context'
const mockUsePomodoroContext = vi.mocked(usePomodoroContext)

describe('PomodoroFloatingPopup', () => {
  beforeEach(() => {
    mockPathname = '/'
    mockUsePomodoroContext.mockReturnValue(mockContext)
    // Mock window dimensions for initialPos
    Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true })
    Object.defineProperty(window, 'innerHeight', { value: 768, writable: true })
  })

  it('deve renderizar popup quando timer ativo e fora de /pomodoro', () => {
    mockPathname = '/'
    render(<PomodoroFloatingPopup />)
    expect(screen.getByTestId('pomodoro-floating-popup')).toBeInTheDocument()
  })

  it('não deve renderizar quando na página /pomodoro', () => {
    mockPathname = '/pomodoro'
    render(<PomodoroFloatingPopup />)
    expect(screen.queryByTestId('pomodoro-floating-popup')).not.toBeInTheDocument()
  })

  it('não deve renderizar quando timer está IDLE', () => {
    mockUsePomodoroContext.mockReturnValue({
      ...mockContext,
      state: { ...mockContext.state, phase: 'IDLE' },
    })
    render(<PomodoroFloatingPopup />)
    expect(screen.queryByTestId('pomodoro-floating-popup')).not.toBeInTheDocument()
  })

  it('deve exibir label da fase WORK como "Foco"', () => {
    render(<PomodoroFloatingPopup />)
    expect(screen.getByText('Foco')).toBeInTheDocument()
  })

  it('deve exibir botão Pausar quando fase ativa', () => {
    render(<PomodoroFloatingPopup />)
    expect(screen.getByText('Pausar')).toBeInTheDocument()
  })

  it('deve exibir botão Retomar quando pausado', () => {
    mockUsePomodoroContext.mockReturnValue({
      ...mockContext,
      state: { ...mockContext.state, phase: 'PAUSED', pausedPhase: 'WORK' },
    })
    render(<PomodoroFloatingPopup />)
    expect(screen.getByText('Retomar')).toBeInTheDocument()
  })

  it('deve navegar para /pomodoro ao clicar Expandir', async () => {
    const user = userEvent.setup()
    render(<PomodoroFloatingPopup />)
    await user.click(screen.getByText('Expandir'))
    expect(mockPush).toHaveBeenCalledWith('/pomodoro')
  })

  it('deve minimizar ao clicar no botão minimizar', async () => {
    const user = userEvent.setup()
    render(<PomodoroFloatingPopup />)
    await user.click(screen.getByLabelText('Minimizar timer'))
    expect(screen.getByTestId('pomodoro-floating-minimized')).toBeInTheDocument()
  })
})
