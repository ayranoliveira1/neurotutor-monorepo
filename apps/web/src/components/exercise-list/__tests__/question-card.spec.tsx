import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionCard } from '../question-card'
import type { QuestionData } from '@/actions/exercise-list/types'

vi.mock('@/components/ui/badge', () => ({
  Badge: ({ children }: { children: React.ReactNode }) => (
    <span>{children}</span>
  ),
}))

const mockQuestion: QuestionData = {
  id: 'q-1',
  externalId: 'ext-1',
  statement: '<p>Qual é a capital do Brasil?</p>',
  imageUrl: null,
  alternatives: ['São Paulo', 'Rio de Janeiro', 'Brasília', 'Salvador'],
  origin: 'ENEM',
  subject: 'Geografia',
  categories: ['Capitais'],
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

describe('QuestionCard', () => {
  it('deve renderizar o enunciado da questão', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={null}
        onSelectAnswer={vi.fn()}
      />
    )

    const statement = document.querySelector('.prose')
    expect(statement).toBeInTheDocument()
    expect(statement?.innerHTML).toContain('Qual é a capital do Brasil?')
  })

  it('deve renderizar todas as alternativas com letras (A, B, C, D)', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={null}
        onSelectAnswer={vi.fn()}
      />
    )

    expect(screen.getByText('A')).toBeInTheDocument()
    expect(screen.getByText('B')).toBeInTheDocument()
    expect(screen.getByText('C')).toBeInTheDocument()
    expect(screen.getByText('D')).toBeInTheDocument()
    expect(screen.getByText('São Paulo')).toBeInTheDocument()
    expect(screen.getByText('Rio de Janeiro')).toBeInTheDocument()
    expect(screen.getByText('Brasília')).toBeInTheDocument()
    expect(screen.getByText('Salvador')).toBeInTheDocument()
  })

  it('deve chamar onSelectAnswer ao clicar em uma alternativa', async () => {
    const user = userEvent.setup()
    const onSelectAnswer = vi.fn()

    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={null}
        onSelectAnswer={onSelectAnswer}
      />
    )

    await user.click(screen.getByText('Brasília'))

    expect(onSelectAnswer).toHaveBeenCalledWith(2)
  })

  it('deve destacar a alternativa selecionada', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={2}
        onSelectAnswer={vi.fn()}
      />
    )

    const buttons = screen.getAllByRole('button')
    const selectedButton = buttons[2]

    expect(selectedButton.className).toContain('border-primary')
    expect(selectedButton.className).toContain('bg-primary/5')
  })

  it('deve mostrar resposta correta em verde quando showResult e correctAnswer definidos', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={1}
        onSelectAnswer={vi.fn()}
        showResult={true}
        correctAnswer={2}
      />
    )

    const buttons = screen.getAllByRole('button')
    const correctButton = buttons[2]

    expect(correctButton.className).toContain('border-green-500')
    expect(correctButton.className).toContain('bg-green-50')
  })

  it('deve mostrar resposta errada em vermelho quando showResult e seleção incorreta', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={1}
        onSelectAnswer={vi.fn()}
        showResult={true}
        correctAnswer={2}
      />
    )

    const buttons = screen.getAllByRole('button')
    const wrongButton = buttons[1]

    expect(wrongButton.className).toContain('border-red-500')
    expect(wrongButton.className).toContain('bg-red-50')
  })

  it('deve desabilitar botões quando disabled=true', () => {
    render(
      <QuestionCard
        question={mockQuestion}
        questionNumber={1}
        selectedAnswer={null}
        onSelectAnswer={vi.fn()}
        disabled={true}
      />
    )

    const buttons = screen.getAllByRole('button')

    buttons.forEach((button) => {
      expect(button).toBeDisabled()
    })
  })
})
