import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AuthFormField } from '../auth-form-field'

const mockRegistration = {
  name: 'email' as const,
  onChange: vi.fn(),
  onBlur: vi.fn(),
  ref: vi.fn(),
}

describe('AuthFormField', () => {
  it('should render label and input', () => {
    render(
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        registration={mockRegistration}
      />,
    )

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('seu@email.com')).toBeInTheDocument()
  })

  it('should render with correct input type', () => {
    render(
      <AuthFormField
        id="password"
        label="Senha"
        type="password"
        placeholder="********"
        registration={{ ...mockRegistration, name: 'password' }}
      />,
    )

    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })

  it('should display error message when provided', () => {
    render(
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        error="E-mail inválido"
        registration={mockRegistration}
      />,
    )

    expect(screen.getByText('E-mail inválido')).toBeInTheDocument()
  })

  it('should not display error message when not provided', () => {
    render(
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        registration={mockRegistration}
      />,
    )

    expect(screen.queryByText('E-mail inválido')).not.toBeInTheDocument()
  })

  it('should show toggle button for password fields', () => {
    render(
      <AuthFormField
        id="password"
        label="Senha"
        type="password"
        placeholder="********"
        registration={{ ...mockRegistration, name: 'password' }}
      />,
    )

    expect(
      screen.getByRole('button', { name: 'Mostrar senha' }),
    ).toBeInTheDocument()
  })

  it('should not show toggle button for non-password fields', () => {
    render(
      <AuthFormField
        id="email"
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        registration={mockRegistration}
      />,
    )

    expect(
      screen.queryByRole('button', { name: 'Mostrar senha' }),
    ).not.toBeInTheDocument()
  })

  it('should toggle password visibility on click', async () => {
    const user = userEvent.setup()
    render(
      <AuthFormField
        id="password"
        label="Senha"
        type="password"
        placeholder="********"
        registration={{ ...mockRegistration, name: 'password' }}
      />,
    )

    const input = screen.getByLabelText('Senha')
    const toggle = screen.getByRole('button', { name: 'Mostrar senha' })

    expect(input).toHaveAttribute('type', 'password')

    await user.click(toggle)
    expect(input).toHaveAttribute('type', 'text')
    expect(
      screen.getByRole('button', { name: 'Ocultar senha' }),
    ).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Ocultar senha' }))
    expect(input).toHaveAttribute('type', 'password')
    expect(
      screen.getByRole('button', { name: 'Mostrar senha' }),
    ).toBeInTheDocument()
  })
})
