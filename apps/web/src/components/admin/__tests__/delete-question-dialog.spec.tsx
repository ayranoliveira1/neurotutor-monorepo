import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteQuestionDialog } from '../delete-question-dialog'

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

vi.mock('@/actions/admin/delete-question', () => ({
  deleteQuestionAction: vi.fn(),
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

describe('DeleteQuestionDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar título e descrição', () => {
    render(
      <DeleteQuestionDialog
        questionId="q-1"
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Excluir questão')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Tem certeza que deseja excluir esta questão? Esta ação não pode ser desfeita.',
      ),
    ).toBeInTheDocument()
  })

  it('deve renderizar botões Cancelar e Excluir', () => {
    render(
      <DeleteQuestionDialog
        questionId="q-1"
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
      <DeleteQuestionDialog
        questionId="q-42"
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'q-42' })
  })

  it('deve chamar onOpenChange ao clicar em Cancelar', async () => {
    const user = userEvent.setup()
    const onOpenChange = vi.fn()

    render(
      <DeleteQuestionDialog
        questionId="q-1"
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
      <DeleteQuestionDialog
        questionId="q-1"
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />,
    )

    actionCallbacks.onSuccess?.()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSuccess).toHaveBeenCalledOnce()
  })

  it('deve mostrar toast de erro quando a ação falha', () => {
    render(
      <DeleteQuestionDialog
        questionId="q-1"
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Questão está vinculada a listas de exercícios' },
    })

    expect(mockToastError).toHaveBeenCalledWith(
      'Questão está vinculada a listas de exercícios',
    )
  })

  it('não deve renderizar quando open=false', () => {
    render(
      <DeleteQuestionDialog
        questionId="q-1"
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.queryByText('Excluir questão')).not.toBeInTheDocument()
  })
})
