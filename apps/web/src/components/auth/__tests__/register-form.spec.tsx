import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useForm } from 'react-hook-form'
import { type SignUpFormInput } from '@/schemas/auth'
import { RegisterFormView, type RegisterFormViewProps } from '../register-form'

function TestRegisterForm(overrides: Partial<RegisterFormViewProps> = {}) {
  const form = useForm<SignUpFormInput>({
    defaultValues: { name: '', email: '', password: '', confirmPassword: '' },
  })

  return (
    <RegisterFormView
      onSubmit={overrides.onSubmit ?? vi.fn((e) => e?.preventDefault())}
      register={form.register}
      errors={overrides.errors ?? form.formState.errors}
      isPending={overrides.isPending ?? false}
      serverError={overrides.serverError}
    />
  )
}

describe('RegisterFormView', () => {
  it('should render name, email, password and confirm password fields', () => {
    render(<TestRegisterForm />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Confirmar senha')).toBeInTheDocument()
  })

  it('should render the submit button', () => {
    render(<TestRegisterForm />)

    expect(
      screen.getByRole('button', { name: 'Criar conta' })
    ).toBeInTheDocument()
  })

  it('should show pending state', () => {
    render(<TestRegisterForm isPending={true} />)

    expect(
      screen.getByRole('button', { name: /Criando conta/i })
    ).toBeDisabled()
  })

  it('should display server error', () => {
    render(<TestRegisterForm serverError="E-mail já cadastrado" />)

    expect(screen.getByText('E-mail já cadastrado')).toBeInTheDocument()
  })

  it('should display field errors', () => {
    render(
      <TestRegisterForm
        errors={{
          name: { type: 'required', message: 'Nome é obrigatório' },
          email: { type: 'required', message: 'E-mail é obrigatório' },
          password: { type: 'required', message: 'Senha é obrigatória' },
          confirmPassword: {
            type: 'validate',
            message: 'As senhas não coincidem',
          },
        }}
      />
    )

    expect(screen.getByText('Nome é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('E-mail é obrigatório')).toBeInTheDocument()
    expect(screen.getByText('Senha é obrigatória')).toBeInTheDocument()
    expect(screen.getByText('As senhas não coincidem')).toBeInTheDocument()
  })

  it('should call onSubmit when form is submitted', async () => {
    const user = userEvent.setup()
    const onSubmit = vi.fn((e) => e?.preventDefault())
    render(<TestRegisterForm onSubmit={onSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Maria Silva')
    await user.type(screen.getByLabelText('E-mail'), 'maria@email.com')
    await user.type(screen.getByLabelText('Senha'), '12345678')
    await user.type(screen.getByLabelText('Confirmar senha'), '12345678')
    await user.click(screen.getByRole('button', { name: 'Criar conta' }))

    expect(onSubmit).toHaveBeenCalled()
  })

  it('should render inputs with correct types', () => {
    render(<TestRegisterForm />)

    expect(screen.getByLabelText('Nome')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('E-mail')).toHaveAttribute('type', 'email')
    expect(screen.getByLabelText('Senha')).toHaveAttribute('type', 'password')
    expect(screen.getByLabelText('Confirmar senha')).toHaveAttribute(
      'type',
      'password'
    )
  })
})
