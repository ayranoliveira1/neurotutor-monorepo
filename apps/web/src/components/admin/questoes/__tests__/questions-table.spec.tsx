import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionsTable } from '../questions-table'
import type { AdminQuestion } from '@/actions/admin/questoes/list-questions'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

const mockQuestions: AdminQuestion[] = [
  {
    id: 'q-1',
    externalId: 'ENEM-2025-001',
    statement:
      'Qual a capital do Brasil? Selecione a alternativa correta dentre as opções apresentadas abaixo.',
    alternatives: ['São Paulo', 'Brasília', 'Rio de Janeiro'],
    origin: 'ENEM',
    subject: 'Geografia',
    categories: ['Capitais'],
    correctAnswer: 1,
    year: 2025,
    difficulty: 'EASY',
    imageUrl: null,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'q-2',
    externalId: 'ENEM-2025-002',
    statement: 'Quanto é 2 + 2? Responda a questão.',
    alternatives: ['3', '4', '5'],
    origin: 'ENEM',
    subject: 'Matemática',
    categories: [],
    correctAnswer: 1,
    year: null,
    difficulty: 'HARD',
    imageUrl: null,
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
  },
]

describe('QuestionsTable', () => {
  it('deve renderizar mensagem vazia quando sem questões', () => {
    render(<QuestionsTable questions={[]} />)
    expect(
      screen.getByText('Nenhuma questão encontrada.'),
    ).toBeInTheDocument()
  })

  it('deve renderizar linhas com dados das questões', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    // Desktop + Mobile = 2x cada
    expect(screen.getAllByText('ENEM-2025-001')).toHaveLength(2)
    expect(screen.getAllByText('ENEM-2025-002')).toHaveLength(2)
  })

  it('deve renderizar disciplinas', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    expect(screen.getAllByText('Geografia').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Matemática').length).toBeGreaterThanOrEqual(1)
  })

  it('deve renderizar badges de dificuldade', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    expect(screen.getAllByText('Fácil').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Difícil').length).toBeGreaterThanOrEqual(1)
  })

  it('deve renderizar link para detalhes', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    const links = screen.getAllByRole('link')
    const detailLinks = links.filter(
      (link) =>
        link.getAttribute('href')?.includes('/admin/questoes/q-1') ||
        link.getAttribute('href')?.includes('/admin/questoes/q-2'),
    )
    expect(detailLinks.length).toBeGreaterThanOrEqual(2)
  })

  it('deve renderizar ano quando disponível', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    expect(screen.getAllByText('2025').length).toBeGreaterThanOrEqual(1)
  })

  it('deve renderizar traço quando ano não disponível', () => {
    render(<QuestionsTable questions={mockQuestions} />)
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(1)
  })
})
