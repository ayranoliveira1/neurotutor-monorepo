import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteUserDialog } from '../delete-user-dialog'

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

vi.mock('@/actions/admin/delete-user', () => ({
  deleteUserAction: vi.fn(),
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

const mockUser = {
  id: 'user-1',
  name: 'Jo\u00e3o Silva',
  email: 'joao@example.com',
  image: null,
  role: 'STUDENT',
  emailVerified: true,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
  subscription: null,
}

describe('DeleteUserDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar t\u00edtulo e descri\u00e7\u00e3o com nome do usu\u00e1rio', () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByText('Excluir usu\u00e1rio')).toBeInTheDocument()
    expect(screen.getByText('Jo\u00e3o Silva')).toBeInTheDocument()
    expect(
      screen.getByText(/Tem certeza que deseja excluir o usu\u00e1rio/)
    ).toBeInTheDocument()
    expect(
      screen.getByText(/Esta a\u00e7\u00e3o n\u00e3o pode ser desfeita/)
    ).toBeInTheDocument()
  })

  it('deve renderizar bot\u00f5es Cancelar e Excluir', () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.getByText('Cancelar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve chamar execute com id do usu\u00e1rio ao clicar em Excluir', async () => {
    const user = userEvent.setup()

    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'user-1' })
  })

  it('deve chamar onOpenChange(false) ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={vi.fn()}
      />
    )

    await user.click(screen.getByText('Cancelar'))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve chamar onSuccess e onOpenChange quando a\u00e7\u00e3o completa com sucesso', () => {
    const onOpenChange = vi.fn()
    const onSuccess = vi.fn()

    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />
    )

    actionCallbacks.onSuccess?.()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSuccess).toHaveBeenCalled()
  })

  it('deve mostrar toast de erro quando a a\u00e7\u00e3o falha com serverError', () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Usu\u00e1rio n\u00e3o encontrado' },
    })

    expect(mockToastError).toHaveBeenCalledWith('Usu\u00e1rio n\u00e3o encontrado')
  })

  it('deve mostrar toast de erro padr\u00e3o quando a a\u00e7\u00e3o falha sem serverError', () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    actionCallbacks.onError?.({ error: {} })

    expect(mockToastError).toHaveBeenCalledWith('Erro ao excluir usu\u00e1rio')
  })

  it('n\u00e3o deve renderizar quando open=false', () => {
    render(
      <DeleteUserDialog
        user={mockUser}
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
