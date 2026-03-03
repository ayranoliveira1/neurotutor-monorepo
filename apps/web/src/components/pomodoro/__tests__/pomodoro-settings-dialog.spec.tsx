import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PomodoroSettingsDialog } from '../pomodoro-settings-dialog'
import { DEFAULT_SETTINGS } from '@/hooks/use-pomodoro-timer'

describe('PomodoroSettingsDialog', () => {
  const defaultProps = {
    open: true,
    onOpenChange: vi.fn(),
    settings: DEFAULT_SETTINGS,
    onSave: vi.fn(),
  }

  it('deve renderizar campos de configuração', () => {
    render(<PomodoroSettingsDialog {...defaultProps} />)
    expect(screen.getByLabelText(/tempo de foco/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/pausa curta/i)).toBeInTheDocument()
    expect(screen.getByLabelText('Pausa longa (min)')).toBeInTheDocument()
    expect(screen.getByLabelText(/ciclos até pausa longa/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/meta diária/i)).toBeInTheDocument()
  })

  it('deve preencher campos com valores padrão', () => {
    render(<PomodoroSettingsDialog {...defaultProps} />)
    const workInput = screen.getByLabelText(/tempo de foco/i) as HTMLInputElement
    expect(workInput.value).toBe('25')
    const shortBreakInput = screen.getByLabelText(/pausa curta/i) as HTMLInputElement
    expect(shortBreakInput.value).toBe('5')
    const longBreakInput = screen.getByLabelText('Pausa longa (min)') as HTMLInputElement
    expect(longBreakInput.value).toBe('15')
    const cyclesInput = screen.getByLabelText(/ciclos até pausa longa/i) as HTMLInputElement
    expect(cyclesInput.value).toBe('4')
    const goalInput = screen.getByLabelText(/meta diária/i) as HTMLInputElement
    expect(goalInput.value).toBe('8')
  })

  it('deve fechar ao clicar em Cancelar', async () => {
    const onOpenChange = vi.fn()
    const user = userEvent.setup()
    render(
      <PomodoroSettingsDialog
        {...defaultProps}
        onOpenChange={onOpenChange}
      />,
    )
    await user.click(screen.getByRole('button', { name: /cancelar/i }))
    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve chamar onSave ao submeter', async () => {
    const onSave = vi.fn()
    const user = userEvent.setup()
    render(<PomodoroSettingsDialog {...defaultProps} onSave={onSave} />)
    await user.click(screen.getByRole('button', { name: /salvar/i }))
    expect(onSave).toHaveBeenCalledWith(DEFAULT_SETTINGS)
  })
})
