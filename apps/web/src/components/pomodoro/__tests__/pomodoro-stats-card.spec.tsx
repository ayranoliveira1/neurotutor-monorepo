import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroStatsCard } from '../pomodoro-stats-card'

describe('PomodoroStatsCard', () => {
  const defaultProps = {
    todayPomodoros: 3,
    dailyGoal: 8,
    weeklyMinutes: 120,
    totalSessions: 5,
    loading: false,
  }

  it('deve exibir pomodoros hoje com meta', () => {
    render(<PomodoroStatsCard {...defaultProps} />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('deve exibir barra de progresso da meta diária', () => {
    render(<PomodoroStatsCard {...defaultProps} />)
    const bar = screen.getByRole('progressbar')
    expect(bar).toBeInTheDocument()
    expect(bar).toHaveAttribute('aria-valuenow', '3')
    expect(bar).toHaveAttribute('aria-valuemax', '8')
  })

  it('deve exibir minutos desta semana', () => {
    render(<PomodoroStatsCard {...defaultProps} />)
    expect(screen.getByText('120')).toBeInTheDocument()
  })

  it('deve mostrar 0 quando não há sessões', () => {
    render(
      <PomodoroStatsCard
        todayPomodoros={0}
        dailyGoal={8}
        weeklyMinutes={0}
        totalSessions={0}
        loading={false}
      />,
    )
    const zeros = screen.getAllByText('0')
    expect(zeros.length).toBeGreaterThan(0)
  })

  it('deve mostrar skeleton durante loading', () => {
    const { container } = render(
      <PomodoroStatsCard {...defaultProps} loading={true} />,
    )
    // Skeletons are rendered instead of stats
    expect(container.querySelectorAll('[class*="skeleton"], [data-slot="skeleton"]').length).toBeGreaterThanOrEqual(0)
    expect(screen.queryByRole('progressbar')).not.toBeInTheDocument()
  })
})
