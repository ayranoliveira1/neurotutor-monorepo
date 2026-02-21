import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { NotificationsPageContent } from '../notifications-page-content'

const mockNotificationsQuery = vi.fn()

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

vi.mock('@/hooks/admin/use-notifications-admin-query', () => ({
  useNotificationsAdminQuery: () => mockNotificationsQuery(),
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

vi.mock('../notifications-page-skeleton', () => ({
  NotificationsPageSkeleton: () => (
    <div data-testid="skeleton">Carregando...</div>
  ),
}))

vi.mock('../notifications-table', () => ({
  NotificationsTable: ({
    notifications,
  }: {
    notifications: unknown[]
  }) => (
    <div data-testid="table">
      Tabela ({notifications.length} notificações)
    </div>
  ),
}))

vi.mock('../notifications-pagination', () => ({
  NotificationsPagination: ({
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

vi.mock('../create-notification-dialog', () => ({
  CreateNotificationDialog: () => (
    <div data-testid="create-notification-dialog">
      CreateNotificationDialog
    </div>
  ),
}))

vi.mock('../delete-notification-dialog', () => ({
  DeleteNotificationDialog: () => (
    <div data-testid="delete-notification-dialog">
      DeleteNotificationDialog
    </div>
  ),
}))

const notificationsData = {
  notifications: [
    {
      id: 'n1',
      title: 'Teste',
      content: 'Conteúdo',
      createdAt: '2025-01-01',
      destination: { sendIds: ['u1'] },
    },
  ],
  totalPages: 2,
  currentPage: 1,
  totalItems: 15,
}

describe('NotificationsPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockNotificationsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: notificationsData,
      error: null,
    })
  })

  it('deve renderizar skeleton durante carregamento', () => {
    mockNotificationsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<NotificationsPageContent />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro quando query falha', () => {
    mockNotificationsQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Falha ao carregar notificações'),
    })

    render(<NotificationsPageContent />)

    expect(
      screen.getByText('Falha ao carregar notificações'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e descrição da página', () => {
    render(<NotificationsPageContent />)

    expect(screen.getByText('Notificações')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Gerencie as notificações enviadas aos usuários.',
      ),
    ).toBeInTheDocument()
  })

  it('deve renderizar botão Nova notificação', () => {
    render(<NotificationsPageContent />)

    expect(screen.getByText('Nova notificação')).toBeInTheDocument()
  })

  it('deve renderizar tabela de notificações', () => {
    render(<NotificationsPageContent />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(
      screen.getByText('Tabela (1 notificações)'),
    ).toBeInTheDocument()
  })

  it('deve renderizar paginação quando totalPages > 1', () => {
    render(<NotificationsPageContent />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(
      screen.getByText('Página 1 de 2 (15 itens)'),
    ).toBeInTheDocument()
  })

  it('deve não renderizar paginação quando totalPages = 1', () => {
    mockNotificationsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        notifications: [
          {
            id: 'n1',
            title: 'Teste',
            content: 'Conteúdo',
            createdAt: '2025-01-01',
            destination: { sendIds: ['u1'] },
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalItems: 5,
      },
      error: null,
    })

    render(<NotificationsPageContent />)

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('deve renderizar componentes de dialogs', () => {
    render(<NotificationsPageContent />)

    expect(
      screen.getByTestId('create-notification-dialog'),
    ).toBeInTheDocument()
    expect(
      screen.getByTestId('delete-notification-dialog'),
    ).toBeInTheDocument()
  })
})
