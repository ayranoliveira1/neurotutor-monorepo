import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { NotificationBell } from '../notification-bell'

const mockExecuteAsync = vi.fn().mockResolvedValue({})

vi.mock('@/hooks/use-notifications-query', () => ({
  useNotificationsQuery: vi.fn(),
}))

vi.mock('next-safe-action/hooks', () => ({
  useAction: () => ({
    executeAsync: mockExecuteAsync,
    isPending: false,
  }),
}))

vi.mock('sonner', () => ({
  toast: {
    error: vi.fn(),
  },
}))

import { useNotificationsQuery } from '@/hooks/use-notifications-query'

const mockUseNotificationsQuery = vi.mocked(useNotificationsQuery)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

const mockNotifications = [
  {
    id: 'notif-1',
    title: 'Aviso importante',
    content: 'Conteúdo do aviso importante para você.',
    readAt: null,
    createdAt: '2025-01-15T10:00:00.000Z',
    updatedAt: null,
  },
  {
    id: 'notif-2',
    title: 'Notificação lida',
    content: 'Esta já foi lida.',
    readAt: '2025-01-15T12:00:00.000Z',
    createdAt: '2025-01-14T10:00:00.000Z',
    updatedAt: null,
  },
]

function renderBell() {
  return render(<NotificationBell />, {
    wrapper: createWrapper(),
  })
}

describe('NotificationBell', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockUseNotificationsQuery.mockReturnValue({
      data: { notifications: mockNotifications },
      isLoading: false,
    } as unknown as ReturnType<typeof useNotificationsQuery>)
  })

  it('should render the bell button', () => {
    renderBell()

    expect(screen.getByLabelText('Notificações')).toBeInTheDocument()
  })

  it('should show unread count badge', () => {
    renderBell()

    expect(screen.getByText('1')).toBeInTheDocument()
  })

  it('should not show badge when all notifications are read', () => {
    mockUseNotificationsQuery.mockReturnValue({
      data: {
        notifications: [
          {
            ...mockNotifications[0],
            readAt: '2025-01-15T12:00:00.000Z',
          },
        ],
      },
      isLoading: false,
    } as unknown as ReturnType<typeof useNotificationsQuery>)

    renderBell()

    const badge = screen.queryByText('1')
    expect(badge).not.toBeInTheDocument()
  })

  it('should open popover and show notifications list', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))

    expect(screen.getByText('Aviso importante')).toBeInTheDocument()
    expect(screen.getByText('Notificação lida')).toBeInTheDocument()
  })

  it('should show "Ler todas" button when there are unread notifications', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))

    expect(screen.getByText('Ler todas')).toBeInTheDocument()
  })

  it('should navigate to detail view when clicking a notification', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))
    await user.click(screen.getByText('Aviso importante'))

    expect(screen.getByText('Detalhes')).toBeInTheDocument()
    expect(
      screen.getByText('Conteúdo do aviso importante para você.'),
    ).toBeInTheDocument()
  })

  it('should navigate back to list from detail view', async () => {
    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))
    await user.click(screen.getByText('Aviso importante'))

    expect(screen.getByText('Detalhes')).toBeInTheDocument()

    const backButton = screen.getByLabelText('Voltar para lista')
    expect(backButton).toBeTruthy()

    await user.click(backButton)

    expect(screen.getByText('Notificação lida')).toBeInTheDocument()
  })

  it('should show empty state when there are no notifications', async () => {
    mockUseNotificationsQuery.mockReturnValue({
      data: { notifications: [] },
      isLoading: false,
    } as unknown as ReturnType<typeof useNotificationsQuery>)

    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))

    expect(screen.getByText('Nenhuma notificação')).toBeInTheDocument()
  })

  it('should show loading state', async () => {
    mockUseNotificationsQuery.mockReturnValue({
      data: undefined,
      isLoading: true,
    } as unknown as ReturnType<typeof useNotificationsQuery>)

    const user = userEvent.setup()
    renderBell()

    await user.click(screen.getByLabelText('Notificações'))

    expect(screen.getByText('Carregando...')).toBeInTheDocument()
  })
})
