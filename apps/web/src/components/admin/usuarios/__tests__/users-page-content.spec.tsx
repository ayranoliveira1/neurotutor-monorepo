import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UsersPageContent } from '../users-page-content'

const mockUsersQuery = vi.fn()
const mockPlansQuery = vi.fn()

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
  },
}))

vi.mock('@/hooks/admin/use-users-query', () => ({
  useUsersQuery: () => mockUsersQuery(),
}))

vi.mock('@/hooks/admin/use-plans-query', () => ({
  usePlansQuery: () => mockPlansQuery(),
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

vi.mock('../users-page-skeleton', () => ({
  UsersPageSkeleton: () => (
    <div data-testid="skeleton">Carregando...</div>
  ),
}))

vi.mock('../users-filters', () => ({
  UsersFilters: () => <div data-testid="filters">Filtros</div>,
}))

vi.mock('../users-table', () => ({
  UsersTable: ({ users }: { users: unknown[] }) => (
    <div data-testid="table">Tabela ({users.length} usuários)</div>
  ),
}))

vi.mock('../users-pagination', () => ({
  UsersPagination: ({
    currentPage,
    totalPages,
    totalItems,
  }: {
    currentPage: number
    totalPages: number
    totalItems: number
  }) => (
    <div data-testid="pagination">
      Página {currentPage} de {totalPages} ({totalItems} itens)
    </div>
  ),
}))

vi.mock('../create-user-dialog', () => ({
  CreateUserDialog: () => (
    <div data-testid="create-user-dialog">CreateUserDialog</div>
  ),
}))

vi.mock('../edit-user-dialog', () => ({
  EditUserDialog: () => (
    <div data-testid="edit-user-dialog">EditUserDialog</div>
  ),
}))

vi.mock('../delete-user-dialog', () => ({
  DeleteUserDialog: () => (
    <div data-testid="delete-user-dialog">DeleteUserDialog</div>
  ),
}))

const usersData = {
  users: [
    {
      id: 'u1',
      name: 'User 1',
      email: 'u1@test.com',
      role: 'STUDENT',
      createdAt: '2025-01-01',
      subscription: null,
    },
  ],
  totalPages: 3,
  currentPage: 1,
  totalItems: 25,
}

describe('UsersPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockUsersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: usersData,
      error: null,
    })

    mockPlansQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: [],
      error: null,
    })
  })

  it('deve renderizar skeleton durante carregamento', () => {
    mockUsersQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<UsersPageContent />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro quando query falha', () => {
    mockUsersQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Falha ao carregar usuários'),
    })

    render(<UsersPageContent />)

    expect(
      screen.getByText('Falha ao carregar usuários'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e descrição da página', () => {
    render(<UsersPageContent />)

    expect(screen.getByText('Usuários')).toBeInTheDocument()
    expect(
      screen.getByText('Gerencie os usuários da plataforma.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar botão Criar usuário', () => {
    render(<UsersPageContent />)

    expect(screen.getByText('Criar usuário')).toBeInTheDocument()
  })

  it('deve renderizar tabela de usuários', () => {
    render(<UsersPageContent />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText('Tabela (1 usuários)')).toBeInTheDocument()
  })

  it('deve renderizar paginação quando totalPages > 1', () => {
    render(<UsersPageContent />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(
      screen.getByText('Página 1 de 3 (25 itens)'),
    ).toBeInTheDocument()
  })

  it('deve não renderizar paginação quando totalPages = 1', () => {
    mockUsersQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        users: [
          {
            id: 'u1',
            name: 'User 1',
            email: 'u1@test.com',
            role: 'STUDENT',
            createdAt: '2025-01-01',
            subscription: null,
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalItems: 5,
      },
      error: null,
    })

    render(<UsersPageContent />)

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('deve renderizar componentes de dialogs', () => {
    render(<UsersPageContent />)

    expect(screen.getByTestId('create-user-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('edit-user-dialog')).toBeInTheDocument()
    expect(screen.getByTestId('delete-user-dialog')).toBeInTheDocument()
  })
})
