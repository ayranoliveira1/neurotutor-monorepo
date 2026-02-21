import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TogglePlanDialog } from '../toggle-plan-dialog'

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

vi.mock('@/actions/admin/update-plan', () => ({
  updatePlanAction: vi.fn(),
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

const mockActivePlan = {
  id: 'p1',
  name: 'Plano Mensal',
  slug: 'mensal',
  priceCents: 2990,
  cycle: 'MONTHLY' as const,
  active: true,
  canDelete: false,
  createdAt: '2025-01-01T00:00:00Z',
  updatedAt: '2025-01-01T00:00:00Z',
}

const mockInactivePlan = {
  ...mockActivePlan,
  active: false,
}

describe('TogglePlanDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    actionCallbacks = {}
  })

  it('deve renderizar "Inativar plano" quando plano está ativo', () => {
    render(
      <TogglePlanDialog
        plan={mockActivePlan}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Inativar plano')).toBeInTheDocument()
    expect(screen.getByText(/inativar/)).toBeInTheDocument()
    expect(screen.getByText('Plano Mensal')).toBeInTheDocument()
    expect(screen.getByText('Inativar')).toBeInTheDocument()
  })

  it('deve renderizar "Ativar plano" quando plano está inativo', () => {
    render(
      <TogglePlanDialog
        plan={mockInactivePlan}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.getByText('Ativar plano')).toBeInTheDocument()
    expect(screen.getByText(/ativar/)).toBeInTheDocument()
    expect(screen.getByText('Plano Mensal')).toBeInTheDocument()
    expect(screen.getByText('Ativar')).toBeInTheDocument()
  })

  it('deve chamar execute com active "false" ao inativar', async () => {
    const user = userEvent.setup()

    render(
      <TogglePlanDialog
        plan={mockActivePlan}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Inativar'))

    expect(mockExecute).toHaveBeenCalledWith({
      id: 'p1',
      active: 'false',
    })
  })

  it('deve chamar execute com active "true" ao ativar', async () => {
    const user = userEvent.setup()

    render(
      <TogglePlanDialog
        plan={mockInactivePlan}
        open={true}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Ativar'))

    expect(mockExecute).toHaveBeenCalledWith({
      id: 'p1',
      active: 'true',
    })
  })

  it('deve chamar onSuccess quando ação completa', () => {
    const onSuccess = vi.fn()
    const onOpenChange = vi.fn()

    render(
      <TogglePlanDialog
        plan={mockActivePlan}
        open={true}
        onOpenChange={onOpenChange}
        onSuccess={onSuccess}
      />,
    )

    actionCallbacks.onSuccess?.()

    expect(onOpenChange).toHaveBeenCalledWith(false)
    expect(onSuccess).toHaveBeenCalledOnce()
  })

  it('não deve renderizar quando open=false', () => {
    render(
      <TogglePlanDialog
        plan={mockActivePlan}
        open={false}
        onOpenChange={vi.fn()}
        onSuccess={vi.fn()}
      />,
    )

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })
})
