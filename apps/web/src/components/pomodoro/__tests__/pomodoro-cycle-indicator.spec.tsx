import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PomodoroCycleIndicator } from '../pomodoro-cycle-indicator'

describe('PomodoroCycleIndicator', () => {
  it('deve renderizar 4 bolinhas para 4 ciclos configurados', () => {
    render(
      <PomodoroCycleIndicator
        pomodorosCompleted={0}
        cyclesBeforeLong={4}
        cyclesSinceLastLong={0}
      />,
    )
    const dots = screen.getAllByLabelText(/ciclo/)
    expect(dots).toHaveLength(4)
  })

  it('bolinhas até cyclesSinceLastLong devem ter aria-label "ciclo completo"', () => {
    render(
      <PomodoroCycleIndicator
        pomodorosCompleted={2}
        cyclesBeforeLong={4}
        cyclesSinceLastLong={2}
      />,
    )
    const filled = screen.getAllByLabelText('ciclo completo')
    expect(filled).toHaveLength(2)
  })

  it('bolinhas restantes devem ter aria-label "ciclo pendente"', () => {
    render(
      <PomodoroCycleIndicator
        pomodorosCompleted={2}
        cyclesBeforeLong={4}
        cyclesSinceLastLong={2}
      />,
    )
    const empty = screen.getAllByLabelText('ciclo pendente')
    expect(empty).toHaveLength(2)
  })

  it('deve exibir contagem de pomodoros', () => {
    render(
      <PomodoroCycleIndicator
        pomodorosCompleted={5}
        cyclesBeforeLong={4}
        cyclesSinceLastLong={1}
      />,
    )
    expect(screen.getByText(/5/)).toBeInTheDocument()
  })
})
