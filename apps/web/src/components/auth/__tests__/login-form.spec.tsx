import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { type SignInInput } from '@/schemas/auth'
import { LoginFormView, type LoginFormViewProps } from '../login-form'

function TestLoginForm(overrides: Partial<LoginFormViewProps> = {}) {
  const form = useForm<SignInInput>({
    defaultValues: { email: '', password: '' },
  })

  return (
    <LoginFormView
      onSubmit={overrides.onSubmit ?? vi.fn((e) => e?.preventDefault())}
      register={form.register}
      errors={overrides.errors ?? form.formState.errors}
      isPending={overrides.isPending ?? false}
      serverError={overrides.serverError}
    />
  )
}

describe('LoginFormView', () => {
  it('should render email and password fields', () => {
    render(<TestLoginForm />)

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
  })

  it('should render the submit button', () => {
    render(<TestLoginForm />)

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
  })

  it('should show pending state', () => {
    render(<TestLoginForm isPending={true} />)

    expect(screen.getByRole('button', { name: /Entrando/i })).toBeDisabled()
  })

  it('should display server error', () => {
    render(<TestLoginForm serverError="Credenciais inválidas" />)

    expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
  })

  it('should display field errors', () => {
    render(
      <TestLoginForm
        errors={{
          email: { type: 'required', message: 'E-mail é obrigatório' },
          password: { type: 'required', message: 'Senha é obrigatória' },
        }}
      />,
    )

    expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
  })

  it('should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e) => e?.preventDefault())
    render(<TestLoginForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('E-mail'), 'maria@email.com')
    await user.type(screen.getByLabelText('Senha'), '12345678')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should render inputs with correct types', () => {
    render(<TestLoginForm />)

    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
  })
})
