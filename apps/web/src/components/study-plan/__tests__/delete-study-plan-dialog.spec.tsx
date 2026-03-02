import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { DeleteStudyPlanDialog } from '../delete-study-plan-dialog'
import type { StudyPlanItem } from '@/actions/study-plan/types'

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

vi.mock('@/actions/study-plan/delete-study-plan', () => ({
  deleteStudyPlanAction: vi.fn(),
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

const makeStudyPlanItem = (
  overrides: Partial<StudyPlanItem> = {},
): StudyPlanItem => ({
  id: 'plan-1',
  name: 'Plano ENEM',
  description: null,
  status: 'ACTIVE',
  startDate: '2026-01-01T00:00:00.000Z',
  endDate: '2026-06-01T00:00:00.000Z',
  goals: [],
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})

describe('DeleteStudyPlanDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar nome do plano no dialog', () => {
    render(
      <DeleteStudyPlanDialog
        studyPlan={makeStudyPlanItem({ name: 'Plano ENEM' })}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Plano ENEM')).toBeInTheDocument()
    expect(
      screen.getByText(/Tem certeza que deseja excluir o plano/i),
    ).toBeInTheDocument()
  })

  it('deve chamar execute com id ao confirmar exclusão', async () => {
    const user = userEvent.setup()

    render(
      <DeleteStudyPlanDialog
        studyPlan={makeStudyPlanItem({ id: 'plan-42' })}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(mockExecute).toHaveBeenCalledWith({ id: 'plan-42' })
  })

  it('deve chamar onSuccess quando ação completa com sucesso', () => {
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <DeleteStudyPlanDialog
        studyPlan={makeStudyPlanItem()}
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
      <DeleteStudyPlanDialog
        studyPlan={makeStudyPlanItem()}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    actionCallbacks.onError?.({
      error: { serverError: 'Erro ao excluir plano' },
    })

    expect(mockToastError).toHaveBeenCalledWith('Erro ao excluir plano')
  })
})
