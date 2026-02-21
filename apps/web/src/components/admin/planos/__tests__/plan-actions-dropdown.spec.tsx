import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlanActionsDropdown } from '../plan-actions-dropdown'

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    'aria-label'?: string
  }) => <button aria-label={ariaLabel}>{children}</button>,
}))

vi.mock('lucide-react', () => ({
  MoreHorizontal: () => <span>...</span>,
  Pencil: () => <span />,
  Trash2: () => <span />,
  Power: () => <span />,
  PowerOff: () => <span />,
}))

const mockActivePlanCanDelete = {
  id: 'p1',
  name: 'Plano Premium',
  slug: 'premium',
  priceCents: 2990,
  cycle: 'MONTHLY' as const,
  active: true,
  canDelete: true,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
}

const mockActivePlanCannotDelete = {
  ...mockActivePlanCanDelete,
  canDelete: false,
}

const mockInactivePlan = {
  ...mockActivePlanCanDelete,
  active: false,
  canDelete: false,
}

describe('PlanActionsDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar botão de ações com aria-label', () => {
    render(
      <PlanActionsDropdown
        plan={mockActivePlanCanDelete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(
      screen.getByLabelText('Ações de Plano Premium'),
    ).toBeInTheDocument()
  })

  it('deve renderizar opção Editar', () => {
    render(
      <PlanActionsDropdown
        plan={mockActivePlanCanDelete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(screen.getByText('Editar')).toBeInTheDocument()
  })

  it('deve chamar onEdit ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(
      <PlanActionsDropdown
        plan={mockActivePlanCanDelete}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Editar'))

    expect(onEdit).toHaveBeenCalledOnce()
  })

  it('deve renderizar Inativar quando plano está ativo e não pode deletar', () => {
    render(
      <PlanActionsDropdown
        plan={mockActivePlanCannotDelete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(screen.getByText('Inativar')).toBeInTheDocument()
  })

  it('deve renderizar Ativar quando plano está inativo', () => {
    render(
      <PlanActionsDropdown
        plan={mockInactivePlan}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(screen.getByText('Ativar')).toBeInTheDocument()
  })

  it('deve renderizar Excluir quando canDelete é true', () => {
    render(
      <PlanActionsDropdown
        plan={mockActivePlanCanDelete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve não renderizar Excluir quando canDelete é false', () => {
    render(
      <PlanActionsDropdown
        plan={mockActivePlanCannotDelete}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />,
    )

    expect(screen.queryByText('Excluir')).not.toBeInTheDocument()
  })
})
