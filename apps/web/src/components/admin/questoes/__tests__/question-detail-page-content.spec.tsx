import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionDetailPageContent } from '../question-detail-page-content'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
    replace: vi.fn(),
    back: vi.fn(),
  }),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({
    invalidateQueries: vi.fn(),
  }),
}))

vi.mock('next-safe-action/hooks', () => ({
  useAction: () => ({
    execute: vi.fn(),
    result: null,
    isPending: false,
  }),
}))

vi.mock('react-hook-form', async () => {
  const actual = await vi.importActual<typeof import('react-hook-form')>(
    'react-hook-form',
  )

  return {
    ...actual,
    useForm: actual.useForm,
    useFieldArray: actual.useFieldArray,
    useWatch: actual.useWatch,
  }
})

vi.mock('@hookform/resolvers/zod', () => ({
  zodResolver: (schema: unknown) => schema,
}))

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}))

const mockQuestion = {
  id: 'q-1',
  externalId: 'ENEM-2025-001',
  statement: 'Qual é a capital do Brasil?',
  imageUrl: null,
  alternatives: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
  origin: 'ENEM',
  subject: 'Geografia',
  categories: ['Capital', 'Brasil'],
  correctAnswer: 2,
  year: 2025,
  difficulty: 'EASY',
  createdAt: '2025-01-15T10:00:00Z',
  updatedAt: '2025-01-15T10:00:00Z',
}

const mockQuery = vi.fn()

vi.mock('@/hooks/admin/use-question-detail-query', () => ({
  useQuestionDetailQuery: (...args: unknown[]) => mockQuery(...args),
}))

vi.mock('@/actions/admin/update-question', () => ({
  updateQuestionAction: vi.fn(),
}))

vi.mock('@/schemas/question', () => ({
  adminUpdateQuestionFormSchema: vi.fn(),
}))

vi.mock('@/components/ui/card', () => ({
  Card: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  CardTitle: ({ children }: { children: React.ReactNode }) => (
    <h2>{children}</h2>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    type,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    type?: 'button' | 'reset' | 'submit'
    variant?: string
  }) => (
    <button onClick={onClick} disabled={disabled} type={type} data-variant={variant}>
      {children}
    </button>
  ),
}))

vi.mock('@/components/ui/input', () => ({
  Input: (props: any) => <input {...props} />,
}))

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    htmlFor?: string
  }) => <label {...props}>{children}</label>,
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    variant,
  }: {
    children: React.ReactNode
    variant?: string
  }) => <span data-variant={variant}>{children}</span>,
}))

vi.mock('../delete-question-dialog', () => ({
  DeleteQuestionDialog: ({
    questionId,
    open,
  }: {
    questionId: string
    open: boolean
  }) => (
    <div data-testid="delete-question-dialog" data-question-id={questionId} data-open={open} />
  ),
}))

vi.mock('../image-url-preview', () => ({
  ImageUrlPreview: ({ url }: { url: string | undefined }) =>
    url ? <div data-testid="image-preview">{url}</div> : null,
}))

describe('QuestionDetailPageContent', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar mensagem de carregamento', () => {
    mockQuery.mockReturnValue({
      isLoading: true,
      isError: false,
      data: null,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Carregando questão...')).toBeInTheDocument()
  })

  it('deve renderizar mensagem de erro com botão voltar', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: true,
      data: null,
      error: new Error('Questão não encontrada'),
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Questão não encontrada')).toBeInTheDocument()
    expect(screen.getByText('Voltar para questões')).toBeInTheDocument()
  })

  it('deve renderizar informações gerais da questão', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Informações Gerais')).toBeInTheDocument()
    expect(screen.getByText('ENEM-2025-001')).toBeInTheDocument()
    expect(screen.getByText('ENEM')).toBeInTheDocument()
    expect(screen.getByText('Geografia')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('deve renderizar badge de dificuldade', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Fácil')).toBeInTheDocument()
  })

  it('deve renderizar enunciado da questão', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Enunciado')).toBeInTheDocument()
    expect(
      screen.getByText('Qual é a capital do Brasil?'),
    ).toBeInTheDocument()
  })

  it('deve renderizar alternativas com destaque na correta', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Alternativas')).toBeInTheDocument()
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('Brasília')).toBeInTheDocument()
    expect(screen.getByText('Salvador')).toBeInTheDocument()

    // Letras das alternativas incorretas (A, B, D)
    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
  })

  it('deve renderizar categorias como badges', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Categorias')).toBeInTheDocument()
    expect(screen.getByText('Capital')).toBeInTheDocument()
    expect(screen.getByText('Brasil')).toBeInTheDocument()
  })

  it('deve renderizar botões Editar e Excluir', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve renderizar botão Voltar para questões', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Voltar para questões')).toBeInTheDocument()
  })

  it('deve renderizar datas de criação e atualização', () => {
    mockQuery.mockReturnValue({
      isLoading: false,
      isError: false,
      data: mockQuestion,
      error: null,
    })

    render(<QuestionDetailPageContent questionId="q-1" />)

    expect(screen.getByText('Metadados')).toBeInTheDocument()
    expect(screen.getByText('Criado em')).toBeInTheDocument()
    expect(screen.getByText('Atualizado em')).toBeInTheDocument()

    const formattedDate = new Date('2025-01-15T10:00:00Z').toLocaleDateString(
      'pt-BR',
      {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      },
    )

    expect(screen.getAllByText(formattedDate)).toHaveLength(2)
  })
})
