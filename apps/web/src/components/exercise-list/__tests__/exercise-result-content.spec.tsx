import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseResultContent } from '../exercise-result-content'

vi.mock('@/hooks/use-exercise-result', () => ({
  useExerciseResult: vi.fn(),
}))

vi.mock('../exercise-resolve-skeleton', () => ({
  ExerciseResolveSkeleton: () => (
    <div data-testid="skeleton">Skeleton</div>
  ),
}))

vi.mock('../question-card', () => ({
  QuestionCard: () => <div data-testid="question-card" />,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    variant,
    size,
    className,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: string
    size?: string
    className?: string
  }) => (
    <button onClick={onClick} disabled={disabled} className={className}>
      {children}
    </button>
  ),
}))

import { useExerciseResult } from '@/hooks/use-exercise-result'

const mockUseExerciseResult = vi.mocked(useExerciseResult)

const mockQuestion = {
  id: 'q-1',
  externalId: 'ext-1',
  statement: '<p>Questão 1</p>',
  imageUrl: null,
  alternatives: ['A', 'B', 'C', 'D'],
  origin: 'ENEM',
  subject: 'Matemática',
  correctAnswer: 2,
  categories: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

const mockAnswer = {
  id: 'ans-1',
  exerciseListId: 'list-1',
  questionId: 'q-1',
  selectedAnswer: 2,
  isCorrect: true,
  timeSpentSeconds: 45,
  createdAt: '2025-01-01T00:00:00.000Z',
}

const baseHookReturn = {
  isLoading: false,
  isError: false,
  error: null,
  exerciseList: {
    name: 'Lista de Matemática',
    correctCount: 7,
    totalQuestions: 10,
    sections: [{ subject: 'Matemática', quantity: 10 }],
  },
  questions: [mockQuestion],
  answersMap: { 'q-1': mockAnswer } as Record<string, typeof mockAnswer>,
  currentIndex: 0,
  currentQuestion: mockQuestion,
  currentAnswer: mockAnswer,
  correctCount: 7,
  totalQuestions: 10,
  percentage: 70,
  totalTimeSeconds: 45,
  avgTimePerQuestion: 45,
  revealedQuestions: {} as Record<string, boolean>,
  revealAnswer: vi.fn(),
  isQuestionRevealed: vi.fn(),
  goToQuestion: vi.fn(),
  goNext: vi.fn(),
  goPrev: vi.fn(),
  goBack: vi.fn(),
}

describe('ExerciseResultContent', () => {
  it('deve mostrar skeleton durante loading', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      isLoading: true,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('deve mostrar erro quando isError é true', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      isError: true,
      error: new Error('Erro ao carregar resultado'),
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('Erro ao carregar resultado')).toBeInTheDocument()
  })

  it('deve exibir pontuação (acertos/total)', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('7/10')).toBeInTheDocument()
  })

  it('deve exibir porcentagem de acerto', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      percentage: 70,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('70% de acerto')).toBeInTheDocument()
  })

  it('deve exibir contagem de corretas e erradas', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      correctCount: 7,
      totalQuestions: 10,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('7 corretas')).toBeInTheDocument()
    expect(screen.getByText('3 erradas')).toBeInTheDocument()
  })

  it('deve exibir tempo total e médio no score card', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      totalTimeSeconds: 120,
      avgTimePerQuestion: 60,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('Total: 2min')).toBeInTheDocument()
    expect(screen.getByText('Média: 1min/questão')).toBeInTheDocument()
  })

  it('deve exibir tempo da questão atual', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      currentAnswer: { ...mockAnswer, timeSpentSeconds: 90 },
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(
      screen.getByText('Tempo nesta questão: 1min 30s'),
    ).toBeInTheDocument()
  })

  it('não deve exibir tempo quando totalTimeSeconds é 0', () => {
    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      totalTimeSeconds: 0,
      avgTimePerQuestion: 0,
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.queryByText(/Total:/)).not.toBeInTheDocument()
  })

  it('deve mostrar botão "Ver resposta correta" para questões erradas', () => {
    const wrongAnswer = {
      ...mockAnswer,
      selectedAnswer: 1,
      isCorrect: false,
    }

    mockUseExerciseResult.mockReturnValue({
      ...baseHookReturn,
      currentAnswer: wrongAnswer,
      answersMap: { 'q-1': wrongAnswer },
      revealedQuestions: {},
    } as any)

    render(<ExerciseResultContent exerciseListId="list-1" />)

    expect(screen.getByText('Ver resposta correta')).toBeInTheDocument()
  })
})
