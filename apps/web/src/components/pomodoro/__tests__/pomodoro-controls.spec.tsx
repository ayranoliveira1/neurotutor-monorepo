import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PomodoroControls } from '../pomodoro-controls'

const defaultProps = {
  isSaving: false,
  onStart: vi.fn(),
  onPause: vi.fn(),
  onResume: vi.fn(),
  onStop: vi.fn(),
  onSkip: vi.fn(),
}

describe('PomodoroControls', () => {
  it('deve renderizar botão Iniciar quando phase=IDLE', () => {
    render(<PomodoroControls {...defaultProps} phase="IDLE" />)
    expect(screen.getByRole('button', { name: /iniciar/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /pausar/i })).not.toBeInTheDocument()
  })

  it('deve renderizar botão Pausar quando phase=WORK', () => {
    render(<PomodoroControls {...defaultProps} phase="WORK" />)
    expect(screen.getByRole('button', { name: /pausar/i })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /iniciar/i })).not.toBeInTheDocument()
  })

  it('deve renderizar botão Retomar quando phase=PAUSED', () => {
    render(<PomodoroControls {...defaultProps} phase="PAUSED" />)
    expect(screen.getByRole('button', { name: /retomar/i })).toBeInTheDocument()
  })

  it('deve chamar onStart ao clicar em Iniciar', async () => {
    const onStart = vi.fn()
    const user = userEvent.setup()
    render(<PomodoroControls {...defaultProps} phase="IDLE" onStart={onStart} />)
    await user.click(screen.getByRole('button', { name: /iniciar/i }))
    expect(onStart).toHaveBeenCalledOnce()
  })

  it('deve chamar onPause ao clicar em Pausar', async () => {
    const onPause = vi.fn()
    const user = userEvent.setup()
    render(<PomodoroControls {...defaultProps} phase="WORK" onPause={onPause} />)
    await user.click(screen.getByRole('button', { name: /pausar/i }))
    expect(onPause).toHaveBeenCalledOnce()
  })

  it('deve chamar onStop ao clicar em Parar', async () => {
    const onStop = vi.fn()
    const user = userEvent.setup()
    render(<PomodoroControls {...defaultProps} phase="WORK" onStop={onStop} />)
    await user.click(screen.getByRole('button', { name: /parar/i }))
    expect(onStop).toHaveBeenCalledOnce()
  })

  it('deve desabilitar botões durante saving (isSaving=true)', () => {
    render(<PomodoroControls {...defaultProps} phase="IDLE" isSaving={true} />)
    const btn = screen.getByRole('button', { name: /iniciar/i })
    expect(btn).toBeDisabled()
  })
})
