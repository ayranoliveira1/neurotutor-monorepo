import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionsPageContent } from '../questions-page-content'

const mockStatsQuery = vi.fn()
const mockListQuery = vi.fn()

vi.mock('@/hooks/admin/use-questions-stats-query', () => ({
  useQuestionsStatsQuery: () => mockStatsQuery(),
}))

vi.mock('@/hooks/admin/use-questions-list-query', () => ({
  useQuestionsListQuery: () => mockListQuery(),
}))

vi.mock('next/navigation', () => ({
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    asChild,
  }: {
    children: React.ReactNode
    asChild?: boolean
  }) => <div>{children}</div>,
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardDescription: ({ children }: { children: React.ReactNode }) => (
    <p>{children}</p>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h3>{children}</h3>
  ),
}))

vi.mock('../questions-page-skeleton', () => ({
  QuestionsPageSkeleton: () => (
    <div data-testid="skeleton">Carregando...</div>
  ),
}))

vi.mock('../questions-filters', () => ({
  QuestionsFilters: () => <div data-testid="filters">Filtros</div>,
}))

vi.mock('../questions-table', () => ({
  QuestionsTable: ({ questions }: { questions: unknown[] }) => (
    <div data-testid="table">Tabela ({questions.length} questões)</div>
  ),
}))

vi.mock('../questions-pagination', () => ({
  QuestionsPagination: ({
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

const statsData = {
  total: 150,
  bySubject: [
    { subject: 'Matemática', count: 80 },
    { subject: 'Português', count: 70 },
  ],
}

const listData = {
  questions: [
    { id: 'q-1', externalId: 'ENEM-001', subject: 'Matemática' },
    { id: 'q-2', externalId: 'ENEM-002', subject: 'Português' },
  ],
  totalItems: 50,
  totalPages: 5,
  currentPage: 1,
}

describe('QuestionsPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mockStatsQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: statsData,
      error: null,
    })

    mockListQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: listData,
      error: null,
    })
  })

  it('deve renderizar skeleton durante carregamento dos stats', () => {
    mockStatsQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<QuestionsPageContent />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro quando stats falha', () => {
    mockStatsQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Falha ao carregar estatísticas'),
    })

    render(<QuestionsPageContent />)

    expect(
      screen.getByText('Falha ao carregar estatísticas'),
    ).toBeInTheDocument()
  })

  it('deve renderizar título e descrição da página', () => {
    render(<QuestionsPageContent />)

    expect(screen.getByText('Questões')).toBeInTheDocument()
    expect(
      screen.getByText('Gerencie as questões da plataforma.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar cards de estatísticas com dados corretos', () => {
    render(<QuestionsPageContent />)

    expect(screen.getByText('Total de Questões')).toBeInTheDocument()
    expect(screen.getByText('150')).toBeInTheDocument()

    expect(screen.getByText('Disciplinas')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()

    expect(screen.getByText('Média por Disciplina')).toBeInTheDocument()
    expect(screen.getByText('75')).toBeInTheDocument()
  })

  it('deve renderizar distribuição por disciplina', () => {
    render(<QuestionsPageContent />)

    expect(screen.getByText('Questões por Disciplina')).toBeInTheDocument()
    expect(
      screen.getByText(
        'Distribuição de questões entre todas as disciplinas.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('80')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
    expect(screen.getByText('70')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de carregamento da lista', () => {
    mockListQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: undefined,
      error: null,
    })

    render(<QuestionsPageContent />)

    expect(screen.getByText('Carregando questões...')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro da lista', () => {
    mockListQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: undefined,
      error: new Error('Erro na lista'),
    })

    render(<QuestionsPageContent />)

    expect(
      screen.getByText('Erro ao carregar questões.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar tabela de questões com dados', () => {
    render(<QuestionsPageContent />)

    expect(screen.getByTestId('table')).toBeInTheDocument()
    expect(screen.getByText('Tabela (2 questões)')).toBeInTheDocument()
  })

  it('deve renderizar paginação quando totalPages > 1', () => {
    render(<QuestionsPageContent />)

    expect(screen.getByTestId('pagination')).toBeInTheDocument()
    expect(
      screen.getByText('Página 1 de 5 (50 itens)'),
    ).toBeInTheDocument()
  })

  it('deve não renderizar paginação quando totalPages = 1', () => {
    mockListQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: {
        questions: [{ id: 'q-1' }],
        totalItems: 5,
        totalPages: 1,
        currentPage: 1,
      },
      error: null,
    })

    render(<QuestionsPageContent />)

    expect(screen.queryByTestId('pagination')).not.toBeInTheDocument()
  })

  it('deve renderizar link para criar questão', () => {
    render(<QuestionsPageContent />)

    const link = screen.getByRole('link', { name: /criar questão/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/admin/questoes/criar')
  })
})
