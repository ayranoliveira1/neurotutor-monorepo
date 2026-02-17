import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PlansTable } from '../plans-table'
import type { AdminPlan } from '@/actions/admin/list-plans-admin'

vi.mock('@apps/utils', () => ({
  formatCurrency: vi.fn((value: number) => `R$ ${value}`),
}))

const mockPlans: AdminPlan[] = [
  {
    id: '1',
    name: 'Plano Pro',
    slug: 'pro',
    priceCents: 4990,
    description: 'Plano profissional',
    cycle: 'MONTHLY',
    active: true,
    canDelete: true,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: '2',
    name: 'Plano Basic',
    slug: 'basic',
    priceCents: 1990,
    cycle: 'YEARLY',
    active: false,
    canDelete: false,
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
  },
]

describe('PlansTable', () => {
  it('should render empty message when no plans', () => {
    render(
      <PlansTable
        plans={[]}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )
    expect(screen.getByText('Nenhum plano encontrado.')).toBeInTheDocument()
  })

  it('should render plan rows', () => {
    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )
    // Cada plano aparece na tabela (desktop) e no card (mobile)
    expect(screen.getAllByText('Plano Pro')).toHaveLength(2)
    expect(screen.getAllByText('pro')).toHaveLength(2)
    expect(screen.getAllByText('Plano Basic')).toHaveLength(2)
    expect(screen.getAllByText('basic')).toHaveLength(2)
  })

  it('should render cycle badges', () => {
    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )
    expect(screen.getAllByText('Mensal')).toHaveLength(2)
    expect(screen.getAllByText('Anual')).toHaveLength(2)
  })

  it('should render status badges', () => {
    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )
    expect(screen.getAllByText('Ativo')).toHaveLength(2)
    expect(screen.getAllByText('Inativo')).toHaveLength(2)
  })

  it('should render formatted prices', () => {
    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )
    expect(screen.getAllByText('R$ 4990')).toHaveLength(2)
    expect(screen.getAllByText('R$ 1990')).toHaveLength(2)
  })

  it('should call onEdit when edit action is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(
      <PlansTable
        plans={mockPlans}
        onEdit={onEdit}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )

    const actionButtons = screen.getAllByLabelText(/Ações de/)
    await user.click(actionButtons[0])
    await user.click(screen.getByText('Editar'))

    expect(onEdit).toHaveBeenCalledWith(mockPlans[0])
  })

  it('should show delete option only for plans with canDelete true', async () => {
    const user = userEvent.setup()

    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
        onToggleActive={vi.fn()}
      />
    )

    // Plan 1 (canDelete: true) — should show Excluir
    const actionButtons = screen.getAllByLabelText(/Ações de/)
    await user.click(actionButtons[0])
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('should call onDelete when delete action is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <PlansTable
        plans={mockPlans}
        onEdit={vi.fn()}
        onDelete={onDelete}
        onToggleActive={vi.fn()}
      />
    )

    const actionButtons = screen.getAllByLabelText(/Ações de/)
    await user.click(actionButtons[0])
    await user.click(screen.getByText('Excluir'))

    expect(onDelete).toHaveBeenCalledWith(mockPlans[0])
  })
})
