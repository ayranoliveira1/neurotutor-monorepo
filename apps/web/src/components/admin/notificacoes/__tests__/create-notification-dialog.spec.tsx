import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CreateNotificationDialog } from '../create-notification-dialog'

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

vi.mock('@/actions/admin/create-notification', () => ({
  createNotificationAction: vi.fn(),
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

vi.mock('../../user-multi-select', () => ({
  UserMultiSelect: () => (
    <div data-testid="user-multi-select">UserMultiSelect</div>
  ),
}))

const defaultProps = {
  open: true,
  onOpenChange: vi.fn(),
  onSuccess: vi.fn(),
}

describe('CreateNotificationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar título e descrição do dialog', () => {
    render(<CreateNotificationDialog {...defaultProps} />)

    expect(
      screen.getByRole('heading', { name: /nova notificação/i }),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/crie uma notificação para enviar aos usuários/i),
    ).toBeInTheDocument()
  })

  it('deve renderizar campos do formulário (Título, Mensagem)', () => {
    render(<CreateNotificationDialog {...defaultProps} />)

    expect(screen.getByLabelText('Título')).toBeInTheDocument()
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument()
  })

  it('deve renderizar checkbox "Enviar para todos os usuários"', () => {
    render(<CreateNotificationDialog {...defaultProps} />)

    expect(
      screen.getByText(/enviar para todos os usuários/i),
    ).toBeInTheDocument()
  })

  it('deve renderizar seletor de destinatários quando sendToAll é false', () => {
    render(<CreateNotificationDialog {...defaultProps} />)

    expect(
      screen.getByTestId('user-multi-select'),
    ).toBeInTheDocument()
  })

  it('deve renderizar botões Cancelar e Enviar notificação', () => {
    render(<CreateNotificationDialog {...defaultProps} />)

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(
      screen.getByRole('button', { name: /enviar notificação/i }),
    ).toBeInTheDocument()
  })

  it('não deve renderizar quando open=false', () => {
    render(<CreateNotificationDialog {...defaultProps} open={false} />)

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
