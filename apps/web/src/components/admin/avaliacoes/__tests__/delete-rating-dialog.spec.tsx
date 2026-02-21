import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteRatingDialog } from '../delete-rating-dialog'

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

vi.mock('@/actions/admin/delete-rating', () => ({
  deleteRatingAction: vi.fn(),
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

vi.mock('lucide-react', () => ({
  Loader2: ({ className }: { className?: string }) => (
    <span data-testid="loader" className={className} />
  ),
}))

const mockRating = {
  id: 'r1',
  userId: 'u1',
  userName: 'Maria Santos',
  userEmail: 'maria@test.com',
  rating: 5,
  description: 'Excelente',
  createdAt: '2025-01-15T10:00:00Z',
}

describe('DeleteRatingDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar t\u00edtulo e descri\u00e7\u00e3o com nome do usu\u00e1rio', () => {
    render(
      <DeleteRatingDialog
        rating={mockRating}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Excluir avalia\u00e7\u00e3o'),
    ).toBeInTheDocument()
    expect(screen.getByText(/Maria Santos/)).toBeInTheDocument()
  })

  it('deve renderizar bot\u00f5es Cancelar e Excluir', () => {
    render(
      <DeleteRatingDialog
        rating={mockRating}
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
      <DeleteRatingDialog
        rating={mockRating}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'r1' })
  })

  it('deve chamar onOpenChange ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <DeleteRatingDialog
        rating={mockRating}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Cancelar'))

    expect(onOpenChange).toHaveBeenCalledWith(false)
  })

  it('deve chamar onSuccess quando a\u00e7\u00e3o completa', () => {
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <DeleteRatingDialog
        rating={mockRating}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />,
    )

    actionCallbacks.onSuccess?.()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSuccess).toHaveBeenCalledOnce()
  })

  it('deve mostrar toast de erro quando a\u00e7\u00e3o falha', () => {
    render(
      <DeleteRatingDialog
        rating={mockRating}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Avalia\u00e7\u00e3o n\u00e3o encontrada' },
    })

    expect(mockToastError).toHaveBeenCalledWith(
      'Avalia\u00e7\u00e3o n\u00e3o encontrada',
    )
  })

  it('n\u00e3o deve renderizar quando open=false', () => {
    render(
      <DeleteRatingDialog
        rating={mockRating}
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
