import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RatingsPageContent } from '../ratings-page-content'

const mockRatingsQuery = vi.fn()

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

vi.mock('@/hooks/admin/use-ratings-query', () => ({
  useRatingsQuery: () => mockRatingsQuery(),
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

vi.mock('../ratings-page-skeleton', () => ({
  RatingsPageSkeleton: () => (
    <div data-testid="skeleton">Carregando...</div>
  ),
}))

vi.mock('../ratings-table', () => ({
  RatingsTable: ({ ratings }: { ratings: unknown[] }) => (
    <div data-testid="table">
      Tabela ({ratings.length} avaliações)
    </div>
  ),
}))

vi.mock('../ratings-pagination', () => ({
  RatingsPagination: ({
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

vi.mock('../delete-rating-dialog', () => ({
  DeleteRatingDialog: () => (
    <div data-testid="delete-rating-dialog">DeleteRatingDialog</div>
  ),
}))

const ratingsData = {
  ratings: [
    {
      id: 'r1',
      score: 5,
      comment: 'Ótimo',
      userId: 'u1',
      userName: 'João',
      createdAt: '2025-01-01',
    },
  ],
  totalPages: 2,
  currentPage: 1,
  totalItems: 12,
}

describe('RatingsPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockRatingsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: ratingsData,
      error: null,
    })
  })

  it('deve renderizar skeleton durante carregamento', () => {
    mockRatingsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<RatingsPageContent />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro quando query falha', () => {
    mockRatingsQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Falha ao carregar avaliações'),
    })

    render(<RatingsPageContent />)

    expect(
      screen.getByText('Falha ao carregar avaliações'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e descrição da página', () => {
    render(<RatingsPageContent />)

    expect(screen.getByText('Avaliações')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Veja as avaliações dos usuários sobre a plataforma.',
      ),
    ).toBeInTheDocument()
  })

  it('deve renderizar tabela de avaliações', () => {
    render(<RatingsPageContent />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(
      screen.getByText('Tabela (1 avaliações)'),
    ).toBeInTheDocument()
  })

  it('deve renderizar paginação quando totalPages > 1', () => {
    render(<RatingsPageContent />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(
      screen.getByText('Página 1 de 2 (12 itens)'),
    ).toBeInTheDocument()
  })

  it('deve não renderizar paginação quando totalPages = 1', () => {
    mockRatingsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        ratings: [
          {
            id: 'r1',
            score: 5,
            comment: 'Ótimo',
            userId: 'u1',
            userName: 'João',
            createdAt: '2025-01-01',
          },
        ],
        totalPages: 1,
        currentPage: 1,
        totalItems: 5,
      },
      error: null,
    })

    render(<RatingsPageContent />)

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('deve renderizar dialog de exclusão', () => {
    render(<RatingsPageContent />)

    expect(
      screen.getByTestId('delete-rating-dialog'),
    ).toBeInTheDocument()
  })
})
