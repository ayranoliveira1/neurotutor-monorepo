import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteNotificationDialog } from '../delete-notification-dialog'

const mockExecute = vi.fn()
let actionCallbacks: {
  onSuccess?: () => void
  onError?: (args: { error: { serverError?: string } }) => void
} = {}

vi.mock('next-safe-action/hooks', () => ({
  useAction: (_action: unknown, opts?: Record<string, unknown>) => {
    actionCallbacks = {
      onSuccess: opts?.onSuccess as () => void,
      onError: opts?.onError as (args: {
        error: { serverError?: string }
      }) => void,
    }
    return {
      execute: mockExecute,
      isPending: false,
    }
  },
}))

vi.mock('@/actions/admin/notificacoes/delete-notification', () => ({
  adminDeleteNotificationAction: vi.fn(),
}))

const mockToastError = vi.fn()

vi.mock('sonner', () => ({
  toast: {
    error: (...args: unknown[]) => mockToastError(...args),
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

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: string
  }) => (
    <button onClick={onClick} disabled={disabled} data-variant={variant}>
      {children}
    </button>
  ),
}))

const mockNotification = {
  id: 'notif-1',
  title: 'Aviso importante',
  content: 'Conteúdo do aviso',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
  destination: {
    sendIds: [
      { userId: 'u1', readAt: null },
      { userId: 'u2', readAt: null },
    ],
  },
}

describe('DeleteNotificationDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar título e descrição com título da notificação', () => {
    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Excluir notificação'),
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Aviso importante/),
    ).toBeInTheDocument()
  })

  it('deve renderizar botões Cancelar e Excluir', () => {
    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve chamar execute com id ao clicar em Excluir', async () => {
    const user = userEvent.setup()

    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'notif-1' })
  })

  it('deve chamar onOpenChange ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Cancelar'))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve chamar onSuccess quando ação completa com sucesso', () => {
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />,
    )

    actionCallbacks.onSuccess?.()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('deve mostrar toast de erro quando ação falha', () => {
    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Notificação não encontrada' },
    })

    expect(mockToastError).toHaveBeenCalledWith(
      'Notificação não encontrada',
    )
  })

  it('deve mostrar toast de erro padrão quando ação falha sem serverError', () => {
    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({ error: {} })

    expect(mockToastError).toHaveBeenCalledWith(
      'Erro ao excluir notificação',
    )
  })

  it('não deve renderizar quando open=false', () => {
    render(
      <DeleteNotificationDialog
        notification={mockNotification}
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
