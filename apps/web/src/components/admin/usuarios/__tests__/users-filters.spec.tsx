import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersFilters } from '../users-filters'
import type { Plan } from '@/actions/admin/planos/list-plans'

const mockPush = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/admin/usuarios',
  useSearchParams: () => mockSearchParams,
}))

const mockPlans: Plan[] = [
  {
    id: 'plan-1',
    name: 'Premium',
    slug: 'premium',
    priceCents: 4990,
    cycle: 'MONTHLY',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'plan-2',
    name: 'Básico',
    slug: 'basico',
    priceCents: 1990,
    cycle: 'MONTHLY',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'plan-3',
    name: 'Inativo',
    slug: 'inativo',
    priceCents: 990,
    cycle: 'MONTHLY',
    active: false,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

describe('UsersFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams = new URLSearchParams()
  })

  it('should render all filter controls', () => {
    render(<UsersFilters plans={mockPlans} />)

    expect(
      screen.getByPlaceholderText('Buscar por nome ou e-mail...'),
    ).toBeInTheDocument()
    expect(screen.getByText('Papel')).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Plano')).toBeInTheDocument()
    expect(screen.getByText('Período de criação')).toBeInTheDocument()
  })

  it('should show only active plans in plan select', () => {
    render(<UsersFilters plans={mockPlans} />)

    const allSelects = screen.getAllByDisplayValue('Todos')
    const planSelect = allSelects[2]
    const options = planSelect.querySelectorAll('option')
    const optionTexts = Array.from(options).map((o) => o.textContent)

    expect(optionTexts).toContain('Premium')
    expect(optionTexts).toContain('Básico')
    expect(optionTexts).not.toContain('Inativo')
  })

  it('should update URL when role filter changes', async () => {
    const user = userEvent.setup()
    render(<UsersFilters plans={mockPlans} />)

    const roleSelect = screen.getAllByDisplayValue('Todos')[0]
    await user.selectOptions(roleSelect, 'ADMIN')

    expect(mockPush).toHaveBeenCalledWith(
      '/admin/usuarios?role=ADMIN',
    )
  })

  it('should update URL when status filter changes', async () => {
    const user = userEvent.setup()
    render(<UsersFilters plans={mockPlans} />)

    const statusSelect = screen.getAllByDisplayValue('Todos')[1]
    await user.selectOptions(statusSelect, 'true')

    expect(mockPush).toHaveBeenCalledWith(
      '/admin/usuarios?active=true',
    )
  })

  it('should preserve existing filters when changing one', async () => {
    mockSearchParams = new URLSearchParams('role=ADMIN')
    const user = userEvent.setup()
    render(<UsersFilters plans={mockPlans} />)

    const statusSelect = screen.getAllByDisplayValue('Todos')[0]
    await user.selectOptions(statusSelect, 'true')

    expect(mockPush).toHaveBeenCalledWith(
      '/admin/usuarios?role=ADMIN&active=true',
    )
  })

  it('should reset page when changing filters', async () => {
    mockSearchParams = new URLSearchParams('page=3&role=STUDENT')
    const user = userEvent.setup()
    render(<UsersFilters plans={mockPlans} />)

    const statusSelect = screen.getAllByDisplayValue('Todos')[0]
    await user.selectOptions(statusSelect, 'true')

    expect(mockPush).toHaveBeenCalledWith(
      expect.not.stringContaining('page='),
    )
  })

  it('should render search input with correct placeholder', () => {
    render(<UsersFilters plans={mockPlans} />)

    const searchInput = screen.getByPlaceholderText(
      'Buscar por nome ou e-mail...',
    )
    expect(searchInput).toBeInTheDocument()
  })

  it('should not show clear filters button when no filters active', () => {
    render(<UsersFilters plans={mockPlans} />)

    expect(screen.queryByText('Limpar filtros')).not.toBeInTheDocument()
  })

  it('should show clear filters button and clear all on click', async () => {
    mockSearchParams = new URLSearchParams('role=ADMIN&active=true')
    const user = userEvent.setup()
    render(<UsersFilters plans={mockPlans} />)

    const clearButton = screen.getByText('Limpar filtros')
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)

    expect(mockPush).toHaveBeenCalledWith('/admin/usuarios')
  })
})
