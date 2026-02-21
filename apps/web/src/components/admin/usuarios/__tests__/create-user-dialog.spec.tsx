import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { CreateUserDialog } from '../create-user-dialog'
import type { Plan } from '@/actions/admin/planos/list-plans'

vi.mock('@next-safe-action/adapter-react-hook-form/hooks', async () => {
  const { useForm: useFormActual } = await vi.importActual<
    typeof import('react-hook-form')
  >('react-hook-form')

  return {
    useHookFormAction: (_action: unknown, resolver: unknown, opts: any) => {
      const form = useFormActual({ ...opts?.formProps, resolver })

      return {
        form,
        handleSubmitWithAction: form.handleSubmit(() => {}),
        action: { isPending: false, result: null },
      }
    },
  }
})

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: (schema: unknown) => schema,
}))

vi.mock('@/actions/admin/usuarios/create-user', () => ({
  createUserAction: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

vi.mock('@/components/ui/dialog', () => ({
  Dialog: ({
    children,
    open,
  }: {
    children: React.ReactNode
    open: boolean
  }) => (open ? <div role="dialog">{children}</div> : null),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} />
  ),
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    htmlFor,
  }: {
    children: React.ReactNode
    htmlFor?: string
  }) => <label htmlFor={htmlFor}>{children}</label>,
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({
    options,
    placeholder,
    id,
    ...props
  }: {
    options: { value: string; label: string }[]
    placeholder?: string
    id?: string
    value?: string
    onChange?: (e: { target: { value: string } }) => void
  }) => (
    <select id={id} {...props}>
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    variant?: string
  }) => (
    <button onClick={onClick} disabled={disabled} type={type}>
      {children}
    </button>
  ),
}))

const mockPlans: Plan[] = [
  {
    id: 'p1',
    name: 'Plano Mensal',
    slug: 'mensal',
    active: true,
    priceCents: 2990,
    cycle: 'MONTHLY',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'p2',
    name: 'Plano Anual',
    slug: 'anual',
    active: true,
    priceCents: 19900,
    cycle: 'YEARLY',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
  {
    id: 'p3',
    name: 'Plano Inativo',
    slug: 'inativo',
    active: false,
    priceCents: 990,
    cycle: 'MONTHLY',
    createdAt: '2025-01-01T00:00:00Z',
    updatedAt: '2025-01-01T00:00:00Z',
  },
]

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  plans: mockPlans,
  onSuccess: vi.fn(),
}

describe('CreateUserDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar t\u00edtulo e descri\u00e7\u00e3o do dialog', () => {
    render(<CreateUserDialog {...defaultProps} />)

    expect(
      screen.getByRole('heading', { name: 'Criar usu\u00e1rio' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Preencha os dados para criar um novo usu\u00e1rio.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar campos do formul\u00e1rio (Nome, E-mail, Senha, Plano, Dura\u00e7\u00e3o, Papel)', () => {
    render(<CreateUserDialog {...defaultProps} />)

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Plano')).toBeInTheDocument()
    expect(screen.getByLabelText('Dura\u00e7\u00e3o (dias)')).toBeInTheDocument()
    expect(screen.getByLabelText('Papel')).toBeInTheDocument()
  })

  it('deve renderizar op\u00e7\u00f5es de planos ativos', () => {
    render(<CreateUserDialog {...defaultProps} />)

    expect(screen.getByText('Plano Mensal')).toBeInTheDocument()
    expect(screen.getByText('Plano Anual')).toBeInTheDocument()
  })

  it('deve n\u00e3o renderizar planos inativos nas op\u00e7\u00f5es', () => {
    render(<CreateUserDialog {...defaultProps} />)

    expect(screen.queryByText('Plano Inativo')).not.toBeInTheDocument()
  })

  it('deve renderizar bot\u00f5es Cancelar e Criar usu\u00e1rio', () => {
    render(<CreateUserDialog {...defaultProps} />)

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Criar usu\u00e1rio' }),
    ).toBeInTheDocument()
  })

  it('n\u00e3o deve renderizar quando open=false', () => {
    render(<CreateUserDialog {...defaultProps} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
