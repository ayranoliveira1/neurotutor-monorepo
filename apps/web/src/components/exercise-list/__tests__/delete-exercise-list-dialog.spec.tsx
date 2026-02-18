import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteExerciseListDialog } from '../delete-exercise-list-dialog'
import type { ExerciseListItem } from '@/actions/exercise-list/types'

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

vi.mock('@/actions/exercise-list/delete-exercise-list', () => ({
  deleteExerciseListAction: vi.fn(),
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

const makeExerciseListItem = (
  overrides: Partial<ExerciseListItem> = {},
): ExerciseListItem => ({
  id: 'list-1',
  name: 'Lista de Matemática',
  shuffleQuestions: false,
  ignoreAnswered: false,
  sections: [],
  totalQuestions: 10,
  status: 'PENDING',
  correctCount: null,
  totalTimeSeconds: null,
  avgTimePerQuestion: null,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
  ...overrides,
})

describe('DeleteExerciseListDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar nome da lista no dialog', () => {
    const exerciseList = makeExerciseListItem({ name: 'Lista de Matemática' })

    render(
      <DeleteExerciseListDialog
        exerciseList={exerciseList}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Lista de Matemática')).toBeInTheDocument()
    expect(
      screen.getByText(/Tem certeza que deseja excluir a lista/i),
    ).toBeInTheDocument()
  })

  it('deve chamar execute com id ao confirmar exclusão', async () => {
    const user = userEvent.setup()

    const exerciseList = makeExerciseListItem({ id: 'list-42' })

    render(
      <DeleteExerciseListDialog
        exerciseList={exerciseList}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'list-42' })
  })

  it('deve chamar onSuccess quando ação completa com sucesso', () => {
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <DeleteExerciseListDialog
        exerciseList={makeExerciseListItem()}
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
      <DeleteExerciseListDialog
        exerciseList={makeExerciseListItem()}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Erro ao excluir lista de exercícios' },
    })

    expect(mockToastError).toHaveBeenCalledWith(
      'Erro ao excluir lista de exercícios',
    )
  })
})
