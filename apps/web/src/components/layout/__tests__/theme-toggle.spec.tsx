import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ThemeToggle } from '../theme-toggle'

const mockSetTheme = vi.fn()
vi.mock('next-themes', () => ({
  useTheme: () => ({ theme: 'system', setTheme: mockSetTheme }),
}))

describe('ThemeToggle', () => {
  it('should render the toggle button', () => {
    render(<ThemeToggle />)
    expect(screen.getByLabelText('Alternar tema')).toBeInTheDocument()
  })

  it('should show theme options on click', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByLabelText('Alternar tema'))

    expect(screen.getByText('Claro')).toBeInTheDocument()
    expect(screen.getByText('Escuro')).toBeInTheDocument()
    expect(screen.getByText('Sistema')).toBeInTheDocument()
  })

  it('should call setTheme when selecting a theme', async () => {
    const user = userEvent.setup()
    render(<ThemeToggle />)

    await user.click(screen.getByLabelText('Alternar tema'))
    await user.click(screen.getByText('Escuro'))

    expect(mockSetTheme).toHaveBeenCalledWith('dark')
  })
})
