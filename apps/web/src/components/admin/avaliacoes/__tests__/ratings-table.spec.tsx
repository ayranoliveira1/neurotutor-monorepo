import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { RatingsTable } from '../ratings-table'
import type { AdminRating } from '@/actions/admin/list-ratings'

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

vi.mock('lucide-react', () => ({
  Star: ({ className }: { className?: string }) => (
    <span data-testid="star" className={className} />
  ),
  Trash2: () => <span data-testid="trash-icon" />,
  Mail: () => <span data-testid="mail-icon" />,
  Calendar: () => <span data-testid="calendar-icon" />,
}))

const mockRatings: AdminRating[] = [
  {
    id: 'r1',
    userId: 'u1',
    userName: 'Jo\u00e3o Silva',
    userEmail: 'joao@test.com',
    rating: 4,
    description: 'Muito bom',
    createdAt: '2025-06-15T10:00:00Z',
  },
]

describe('RatingsTable', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar estado vazio', () => {
    render(<RatingsTable ratings={[]} onDelete={vi.fn()} />)

    expect(
      screen.getByText('Nenhuma avalia\u00e7\u00e3o encontrada.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar nome e email do usu\u00e1rio', () => {
    render(<RatingsTable ratings={mockRatings} onDelete={vi.fn()} />)

    const names = screen.getAllByText('Jo\u00e3o Silva')
    expect(names.length).toBeGreaterThanOrEqual(1)

    const emails = screen.getAllByText('joao@test.com')
    expect(emails.length).toBeGreaterThanOrEqual(1)
  })

  it('deve renderizar descri\u00e7\u00e3o da avalia\u00e7\u00e3o', () => {
    render(<RatingsTable ratings={mockRatings} onDelete={vi.fn()} />)

    const descriptions = screen.getAllByText('Muito bom')
    expect(descriptions.length).toBeGreaterThanOrEqual(1)
  })

  it('deve chamar onDelete ao clicar em excluir', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(<RatingsTable ratings={mockRatings} onDelete={onDelete} />)

    const deleteButtons = screen.getAllByLabelText('Excluir avalia\u00e7\u00e3o')
    await user.click(deleteButtons[0])

    expect(onDelete).toHaveBeenCalledWith(mockRatings[0])
  })
})
