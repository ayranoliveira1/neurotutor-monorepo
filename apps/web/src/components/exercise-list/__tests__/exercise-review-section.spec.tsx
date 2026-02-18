import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseReviewSection } from '../exercise-review-section'
import type { QuestionData } from '@/actions/exercise-list/types'

vi.mock('../question-card', () => ({
  QuestionCard: ({ questionNumber }: { questionNumber: number }) => (
    <div data-testid="question-card">Questão {questionNumber}</div>
  ),
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    variant?: string
  }) => (
    <button onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
}))

const makeQuestion = (
  overrides: Partial<QuestionData> = {},
): QuestionData => ({
  id: 'q-1',
  externalId: 'ext-1',
  statement: '<p>Questão</p>',
  imageUrl: null,
  alternatives: ['A', 'B', 'C', 'D'],
  origin: 'ENEM',
  subject: 'Matemática',
  categories: [],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
  ...overrides,
})

const baseProps = {
  questions: [
    makeQuestion({ id: 'q-1' }),
    makeQuestion({ id: 'q-2' }),
    makeQuestion({ id: 'q-3' }),
  ],
  mergedAnswers: { 'q-1': 0, 'q-2': 2 } as Record<string, number>,
  answeredCount: 2,
  totalQuestions: 3,
  finishing: false,
  onFinish: vi.fn(),
  onBackToQuestions: vi.fn(),
}

describe('ExerciseReviewSection', () => {
  it('deve renderizar grid com todos os números das questões', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    const items = screen.getAllByTestId('review-item')
    expect(items).toHaveLength(3)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('deve mostrar letra da alternativa marcada nos itens respondidos', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
  })

  it('deve exibir primeira questão expandida ao abrir', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByTestId('question-card')).toBeInTheDocument()
    expect(screen.getByText('Questão 1')).toBeInTheDocument()
  })

  it('deve colapsar questão ao clicar novamente no item expandido', async () => {
    const user = userEvent.setup()

    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByTestId('question-card')).toBeInTheDocument()

    await user.click(screen.getByText('1'))
    expect(screen.queryByTestId('question-card')).not.toBeInTheDocument()
  })

  it('deve trocar questão expandida ao clicar em outro item', async () => {
    const user = userEvent.setup()

    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('Questão 1')).toBeInTheDocument()

    await user.click(screen.getByText('2'))
    expect(screen.getByText('Questão 2')).toBeInTheDocument()
    expect(screen.queryByText('Questão 1')).not.toBeInTheDocument()
  })

  it('deve mostrar contagem de respondidas', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('2 de 3 respondidas')).toBeInTheDocument()
  })

  it('deve renderizar título "Revisão"', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('Revisão')).toBeInTheDocument()
  })

  it('deve renderizar botão "Finalizar"', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('Finalizar')).toBeInTheDocument()
  })

  it('deve renderizar botão "Voltar às questões"', () => {
    render(<ExerciseReviewSection {...baseProps} />)

    expect(screen.getByText('Voltar às questões')).toBeInTheDocument()
  })

  it('deve chamar onFinish ao clicar Finalizar com todas respondidas', async () => {
    const user = userEvent.setup()
    const onFinish = vi.fn()

    render(
      <ExerciseReviewSection
        {...baseProps}
        answeredCount={3}
        onFinish={onFinish}
      />,
    )

    await user.click(screen.getByText('Finalizar'))

    expect(onFinish).toHaveBeenCalledOnce()
  })

  it('deve chamar onBackToQuestions ao clicar Voltar', async () => {
    const user = userEvent.setup()
    const onBackToQuestions = vi.fn()

    render(
      <ExerciseReviewSection
        {...baseProps}
        onBackToQuestions={onBackToQuestions}
      />,
    )

    await user.click(screen.getByText('Voltar às questões'))

    expect(onBackToQuestions).toHaveBeenCalledOnce()
  })

  it('deve desabilitar Finalizar quando nem todas as questões foram respondidas', () => {
    render(
      <ExerciseReviewSection
        {...baseProps}
        answeredCount={2}
        totalQuestions={3}
      />,
    )

    const finishButton = screen.getByText('Finalizar').closest('button')
    expect(finishButton).toBeDisabled()
  })

  it('deve desabilitar Finalizar durante finishing', () => {
    render(<ExerciseReviewSection {...baseProps} finishing={true} />)

    const finishButton = screen.getByText('Finalizar').closest('button')
    expect(finishButton).toBeDisabled()
  })
})
