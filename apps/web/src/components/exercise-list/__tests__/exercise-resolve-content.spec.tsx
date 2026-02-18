import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseResolveContent } from '../exercise-resolve-content'

vi.mock('@/hooks/use-exercise-resolve', () => ({
  useExerciseResolve: vi.fn(),
}))

vi.mock('../exercise-resolve-skeleton', () => ({
  ExerciseResolveSkeleton: () => (
    <div data-testid="skeleton">Skeleton</div>
  ),
}))

vi.mock('../question-card', () => ({
  QuestionCard: ({ questionNumber }: { questionNumber: number }) => (
    <div data-testid="question-card">Questão {questionNumber}</div>
  ),
}))

vi.mock('../exercise-review-section', () => ({
  ExerciseReviewSection: () => (
    <div data-testid="review-section">Revisão</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    size,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: string
    size?: string
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

import { useExerciseResolve } from '@/hooks/use-exercise-resolve'

const mockUseExerciseResolve = vi.mocked(useExerciseResolve)

const baseHookReturn = {
  isLoading: false,
  isError: false,
  error: null,
  exerciseList: {
    name: 'Lista de Matemática',
    status: 'IN_PROGRESS' as const,
    sections: [{ subject: 'Matemática', quantity: 10 }],
  },
  questions: [
    {
      id: 'q-1',
      externalId: 'ext-1',
      statement: '<p>Questão 1</p>',
      imageUrl: null,
      alternatives: ['A', 'B', 'C', 'D'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: [],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
    {
      id: 'q-2',
      externalId: 'ext-2',
      statement: '<p>Questão 2</p>',
      imageUrl: null,
      alternatives: ['A', 'B', 'C', 'D'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: [],
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ],
  currentIndex: 0,
  currentQuestion: {
    id: 'q-1',
    externalId: 'ext-1',
    statement: '<p>Questão 1</p>',
    imageUrl: null,
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM',
    subject: 'Matemática',
    categories: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  totalQuestions: 2,
  mergedAnswers: {} as Record<string, number>,
  answeredCount: 0,
  submitting: false,
  finishing: false,
  isFinished: false,
  showReview: false,
  handleSelectAnswer: vi.fn(),
  handleFinish: vi.fn(),
  goToQuestion: vi.fn(),
  goNext: vi.fn(),
  goPrev: vi.fn(),
  goBackToQuestions: vi.fn(),
  goBack: vi.fn(),
}

describe('ExerciseResolveContent', () => {
  it('deve mostrar skeleton durante loading', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
      isLoading: true,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve mostrar erro quando isError é true', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
      isError: true,
      error: new Error('Erro ao carregar lista'),
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByText('Erro ao carregar lista')).toBeInTheDocument()
  })

  it('deve renderizar o nome da lista', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByText('Lista de Matemática')).toBeInTheDocument()
  })

  it('deve renderizar o contador de respostas', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
      answeredCount: 1,
      totalQuestions: 2,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByText('1 de 2 respondidas')).toBeInTheDocument()
  })

  it('deve renderizar botões de navegação', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByText('Anterior')).toBeInTheDocument()
    expect(screen.getByText('Próxima')).toBeInTheDocument()
  })

  it('deve renderizar tela de revisão quando showReview é true', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
      showReview: true,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    expect(screen.getByTestId('review-section')).toBeInTheDocument()
    expect(screen.queryByText('Lista de Matemática')).not.toBeInTheDocument()
  })

  it('deve manter botão Próxima habilitado na última questão', () => {
    mockUseExerciseResolve.mockReturnValue({
      ...baseHookReturn,
      currentIndex: 1,
      totalQuestions: 2,
    } as any)

    render(<ExerciseResolveContent exerciseListId="list-1" />)

    const nextButton = screen.getByText('Próxima').closest('button')
    expect(nextButton).not.toBeDisabled()
  })
})
