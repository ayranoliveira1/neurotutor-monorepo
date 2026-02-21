import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PlansPageContent } from '../plans-page-content'

const mockPlansQuery = vi.fn()

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

vi.mock('@/hooks/admin/use-plans-admin-query', () => ({
  usePlansAdminQuery: () => mockPlansQuery(),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('../plans-page-skeleton', () => ({
  PlansPageSkeleton: () => (
    <div data-testid="skeleton">Carregando...</div>
  ),
}))

vi.mock('../plans-table', () => ({
  PlansTable: ({ plans }: { plans: unknown[] }) => (
    <div data-testid="plans-table">Tabela ({plans.length} planos)</div>
  ),
}))

vi.mock('../create-plan-dialog', () => ({
  CreatePlanDialog: () => (
    <div data-testid="create-plan-dialog">CreatePlanDialog</div>
  ),
}))

vi.mock('../edit-plan-dialog', () => ({
  EditPlanDialog: () => (
    <div data-testid="edit-plan-dialog">EditPlanDialog</div>
  ),
}))

vi.mock('../delete-plan-dialog', () => ({
  DeletePlanDialog: () => (
    <div data-testid="delete-plan-dialog">DeletePlanDialog</div>
  ),
}))

vi.mock('../toggle-plan-dialog', () => ({
  TogglePlanDialog: () => (
    <div data-testid="toggle-plan-dialog">TogglePlanDialog</div>
  ),
}))

const plansData = [
  {
    id: 'p1',
    name: 'Plano Mensal',
    slug: 'mensal',
    priceCents: 2990,
    cycle: 'MONTHLY',
    active: true,
    description: null,
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
  {
    id: 'p2',
    name: 'Plano Anual',
    slug: 'anual',
    priceCents: 19900,
    cycle: 'YEARLY',
    active: false,
    description: 'Melhor custo',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
  },
]

describe('PlansPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockPlansQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: plansData,
      error: null,
    })
  })

  it('deve renderizar skeleton durante carregamento', () => {
    mockPlansQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<PlansPageContent />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro quando query falha', () => {
    mockPlansQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Falha ao carregar planos'),
    })

    render(<PlansPageContent />)

    expect(
      screen.getByText('Falha ao carregar planos'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e descrição da página', () => {
    render(<PlansPageContent />)

    expect(screen.getByText('Planos')).toBeInTheDocument()
    expect(
      screen.getByText('Gerencie os planos da plataforma.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar botão Criar plano', () => {
    render(<PlansPageContent />)

    expect(screen.getByText('Criar plano')).toBeInTheDocument()
  })

  it('deve renderizar tabela de planos', () => {
    render(<PlansPageContent />)

    expect(screen.getByTestId('plans-table')).toBeInTheDocument()
    expect(screen.getByText('Tabela (2 planos)')).toBeInTheDocument()
  })

  it('deve renderizar componentes de dialogs', () => {
    render(<PlansPageContent />)

    expect(screen.getByTestId('create-plan-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('edit-plan-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('delete-plan-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('toggle-plan-dialog')).toBeInTheDocument()
  })
})
