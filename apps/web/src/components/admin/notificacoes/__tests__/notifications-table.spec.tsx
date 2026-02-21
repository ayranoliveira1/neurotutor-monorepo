import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { NotificationsTable } from '../notifications-table'

vi.mock('@/components/ui/table', () => ({
  Table: ({ children }: { children: React.ReactNode }) => (
    <table>{children}</table>
  ),
  TableHeader: ({ children }: { children: React.ReactNode }) => (
    <thead>{children}</thead>
  ),
  TableBody: ({ children }: { children: React.ReactNode }) => (
    <tbody>{children}</tbody>
  ),
  TableRow: ({ children }: { children: React.ReactNode }) => (
    <tr>{children}</tr>
  ),
  TableHead: ({ children }: { children: React.ReactNode }) => (
    <th>{children}</th>
  ),
  TableCell: ({ children }: { children: React.ReactNode }) => (
    <td>{children}</td>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    'aria-label'?: string
  }) => (
    <button onClick={onClick} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

const mockNotifications = [
  {
    id: 'n1',
    title: 'Bem-vindo',
    content: 'Seja bem-vindo à plataforma',
    createdAt: '2025-06-15T10:00:00Z',
    updatedAt: '2025-06-15T10:00:00Z',
    destination: {
      sendIds: [
        { userId: 'u1', readAt: null },
        { userId: 'u2', readAt: null },
        { userId: 'u3', readAt: null },
      ],
    },
  },
]

describe('NotificationsTable', () => {
  it('deve renderizar estado vazio', () => {
    render(
      <NotificationsTable notifications={[]} onDelete={vi.fn()} />,
    )

    expect(
      screen.getByText('Nenhuma notificação encontrada'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e conteúdo da notificação', () => {
    render(
      <NotificationsTable
        notifications={mockNotifications}
        onDelete={vi.fn()}
      />,
    )

    const titles = screen.getAllByText('Bem-vindo')
    expect(titles.length).toBeGreaterThanOrEqual(1)
    const contents = screen.getAllByText('Seja bem-vindo à plataforma')
    expect(contents.length).toBeGreaterThanOrEqual(1)
  })

  it('deve renderizar contagem de destinatários', () => {
    render(
      <NotificationsTable
        notifications={mockNotifications}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('deve renderizar data formatada', () => {
    render(
      <NotificationsTable
        notifications={mockNotifications}
        onDelete={vi.fn()}
      />,
    )

    const dates = screen.getAllByText(/15\/06\/2025/)
    expect(dates.length).toBeGreaterThanOrEqual(1)
  })

  it('deve chamar onDelete ao clicar em excluir', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <NotificationsTable
        notifications={mockNotifications}
        onDelete={onDelete}
      />,
    )

    const deleteButtons = screen.getAllByLabelText('Excluir notificação')
    await user.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith(mockNotifications[0])
  })
})
