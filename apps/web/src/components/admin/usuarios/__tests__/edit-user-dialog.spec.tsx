import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { EditUserDialog } from '../edit-user-dialog'
import type { AdminUser } from '@/actions/admin/usuarios/list-users'
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

vi.mock('@/actions/admin/update-user', () => ({
  updateUserAction: vi.fn(),
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

vi.mock('@/components/ui/separator', () => ({
  Separator: () => <hr />,
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

const mockUserWithSubscription: AdminUser = {
  id: 'user-1',
  name: 'Maria Santos',
  email: 'maria@example.com',
  image: null,
  role: 'STUDENT',
  emailVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  subscription: {
    id: 'sub-1',
    planId: 'p1',
    planName: 'Plano Mensal',
    active: true,
    endDate: '2025-02-01T00:00:00Z',
  },
}

const mockUserWithoutSubscription: AdminUser = {
  id: 'user-2',
  name: 'João Silva',
  email: 'joao@example.com',
  image: null,
  role: 'ADMIN',
  emailVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  subscription: null,
}

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
]

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSuccess: vi.fn(),
  plans: mockPlans,
}

describe('EditUserDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar título e descrição do dialog', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        user={mockUserWithSubscription}
      />,
    )

    expect(
      screen.getByRole('heading', { name: 'Editar usuário' }),
    ).toBeInTheDocument()
    expect(
      screen.getByText('Altere os dados do usuário e sua assinatura.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar campos básicos do formulário (Nome, E-mail, Papel)', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        user={mockUserWithSubscription}
      />,
    )

    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument()
    expect(screen.getByLabelText('Papel')).toBeInTheDocument()
  })

  it('deve renderizar seção de assinatura quando usuário tem subscription', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        user={mockUserWithSubscription}
      />,
    )

    expect(screen.getByText('Assinatura')).toBeInTheDocument()
    expect(screen.getByLabelText('Plano')).toBeInTheDocument()
    expect(screen.getByLabelText('Data de validade')).toBeInTheDocument()
    expect(screen.getByLabelText('Status')).toBeInTheDocument()
  })

  it('deve não renderizar seção de assinatura quando usuário não tem subscription', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        user={mockUserWithoutSubscription}
      />,
    )

    expect(screen.queryByText('Assinatura')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Plano')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Data de validade')).not.toBeInTheDocument()
    expect(screen.queryByLabelText('Status')).not.toBeInTheDocument()
  })

  it('deve renderizar botões Cancelar e Salvar alterações', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        user={mockUserWithSubscription}
      />,
    )

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: 'Salvar alterações' }),
    ).toBeInTheDocument()
  })

  it('não deve renderizar quando open=false', () => {
    render(
      <EditUserDialog
        {...defaultProps}
        open={false}
        user={mockUserWithSubscription}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
