import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PomodoroSoundSelector } from '../pomodoro-sound-selector'

describe('PomodoroSoundSelector', () => {
  it('deve renderizar opções: Nenhum, Chuva, Café, Biblioteca', () => {
    render(<PomodoroSoundSelector selected="none" onSelect={vi.fn()} />)
    expect(screen.getByText('Nenhum')).toBeInTheDocument()
    expect(screen.getByText('Chuva')).toBeInTheDocument()
    expect(screen.getByText('Café')).toBeInTheDocument()
    expect(screen.getByText('Biblioteca')).toBeInTheDocument()
  })

  it('deve chamar onSelect com valor correto ao clicar', async () => {
    const onSelect = vi.fn()
    const user = userEvent.setup()
    render(<PomodoroSoundSelector selected="none" onSelect={onSelect} />)
    await user.click(screen.getByText('Chuva'))
    expect(onSelect).toHaveBeenCalledWith('rain')
  })

  it('deve marcar opção selecionada com aria-pressed=true', () => {
    render(<PomodoroSoundSelector selected="rain" onSelect={vi.fn()} />)
    const rainBtn = screen.getByText('Chuva').closest('button')
    expect(rainBtn).toHaveAttribute('aria-pressed', 'true')
  })

  it('opções não selecionadas devem ter aria-pressed=false', () => {
    render(<PomodoroSoundSelector selected="rain" onSelect={vi.fn()} />)
    const cafeBtn = screen.getByText('Café').closest('button')
    expect(cafeBtn).toHaveAttribute('aria-pressed', 'false')
  })
})
