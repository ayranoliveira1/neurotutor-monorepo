import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ExerciseListsTable } from '../exercise-lists-table'
import type { ExerciseListItem } from '@/actions/exercise-list/types'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
    className?: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('@/components/ui/badge', () => ({
  Badge: ({
    children,
    className,
  }: {
    children: React.ReactNode
    className?: string
    variant?: string
  }) => <span className={className}>{children}</span>,
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

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
      ...props
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    h3: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <h3 className={className}>{children}</h3>,
    p: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <p className={className}>{children}</p>,
  },
}))

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <div onClick={onClick}>{children}</div>,
}))

const makeExerciseListItem = (
  overrides: Partial<ExerciseListItem> = {},
): ExerciseListItem => ({
  id: 'list-1',
  name: 'Lista de Matemática',
  shuffleQuestions: false,
  ignoreAnswered: false,
  sections: [],
  totalQuestions: 10,
  status: 'PENDING',
  correctCount: null,
  totalTimeSeconds: null,
  avgTimePerQuestion: null,
  createdAt: '2025-01-15T10:00:00.000Z',
  updatedAt: '2025-01-15T10:00:00.000Z',
  ...overrides,
})

describe('ExerciseListsTable', () => {
  it('deve exibir empty state convidando a criar lista quando não há filtros', () => {
    render(
      <ExerciseListsTable
        exerciseLists={[]}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(
      screen.getByText('Comece sua jornada de estudos!'),
    ).toBeInTheDocument()
    expect(screen.getByText('Criar primeira lista')).toBeInTheDocument()
  })

  it('deve exibir empty state de filtros quando há filtros ativos', () => {
    render(
      <ExerciseListsTable
        exerciseLists={[]}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={true}
      />,
    )

    expect(
      screen.getByText('Nenhum resultado encontrado'),
    ).toBeInTheDocument()
  })

  it('deve renderizar cards para cada lista', () => {
    const lists = [
      makeExerciseListItem({ id: 'list-1', name: 'Lista de Matemática' }),
      makeExerciseListItem({ id: 'list-2', name: 'Lista de Português' }),
      makeExerciseListItem({ id: 'list-3', name: 'Lista de História' }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Lista de Matemática')).toBeInTheDocument()
    expect(screen.getByText('Lista de Português')).toBeInTheDocument()
    expect(screen.getByText('Lista de História')).toBeInTheDocument()
  })

  it('deve exibir badge de status Pendente', () => {
    const lists = [makeExerciseListItem({ status: 'PENDING' })]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Pendente')).toBeInTheDocument()
  })

  it('deve exibir badge de status Em andamento', () => {
    const lists = [makeExerciseListItem({ status: 'IN_PROGRESS' })]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('deve exibir badge de status Finalizada', () => {
    const lists = [
      makeExerciseListItem({
        status: 'FINISHED',
        correctCount: 7,
        totalQuestions: 10,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Finalizada')).toBeInTheDocument()
  })

  it('deve exibir porcentagem e contagem de acertos para listas finalizadas', () => {
    const lists = [
      makeExerciseListItem({
        status: 'FINISHED',
        correctCount: 7,
        totalQuestions: 10,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('70% (7/10)')).toBeInTheDocument()
  })

  it('deve aplicar classe de cor vermelha no badge para porcentagem menor que 20%', () => {
    const lists = [
      makeExerciseListItem({
        id: 'list-red',
        status: 'FINISHED',
        correctCount: 1,
        totalQuestions: 10,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    const badge = screen.getByText('10% (1/10)')
    expect(badge.className).toContain('bg-red-100')
  })

  it('deve exibir "Resolver" no dropdown quando status é PENDING', () => {
    const lists = [makeExerciseListItem({ status: 'PENDING' })]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Resolver')).toBeInTheDocument()
  })

  it('deve exibir "Continuar resolvendo" no dropdown quando status é IN_PROGRESS', () => {
    const lists = [makeExerciseListItem({ status: 'IN_PROGRESS' })]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Continuar resolvendo')).toBeInTheDocument()
  })

  it('deve exibir tempo total e médio com labels quando disponível', () => {
    const lists = [
      makeExerciseListItem({
        status: 'FINISHED',
        correctCount: 7,
        totalTimeSeconds: 300,
        avgTimePerQuestion: 30,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Tempo total')).toBeInTheDocument()
    expect(screen.getByText('5min')).toBeInTheDocument()
    expect(screen.getByText('Média por questão')).toBeInTheDocument()
    expect(screen.getByText('30s')).toBeInTheDocument()
  })

  it('deve exibir labels com "Não finalizada" quando status é IN_PROGRESS', () => {
    const lists = [
      makeExerciseListItem({
        status: 'IN_PROGRESS',
        totalTimeSeconds: 300,
        avgTimePerQuestion: 30,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Tempo total')).toBeInTheDocument()
    expect(screen.getByText('Média por questão')).toBeInTheDocument()
    expect(screen.getAllByText('Não finalizada')).toHaveLength(2)
    expect(screen.queryByText('5min')).not.toBeInTheDocument()
  })

  it('deve exibir labels com "Não finalizada" quando status é PENDING', () => {
    const lists = [
      makeExerciseListItem({
        status: 'PENDING',
        totalTimeSeconds: null,
        avgTimePerQuestion: null,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Tempo total')).toBeInTheDocument()
    expect(screen.getAllByText('Não finalizada')).toHaveLength(2)
  })

  it('deve exibir badges de subject das seções', () => {
    const lists = [
      makeExerciseListItem({
        sections: [
          { subject: 'Matemática', quantity: 5 },
          { subject: 'Português', quantity: 5 },
        ],
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })

  it('deve exibir no máximo 2 subjects e mostrar +N para os restantes', () => {
    const lists = [
      makeExerciseListItem({
        sections: [
          { subject: 'Matemática', quantity: 3 },
          { subject: 'Português', quantity: 3 },
          { subject: 'História', quantity: 2 },
          { subject: 'Geografia', quantity: 2 },
        ],
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
    expect(screen.getByText('+2')).toBeInTheDocument()
    expect(screen.queryByText('História')).not.toBeInTheDocument()
    expect(screen.queryByText('Geografia')).not.toBeInTheDocument()
  })

  it('deve aplicar classe de cor azul no badge para porcentagem maior ou igual a 80%', () => {
    const lists = [
      makeExerciseListItem({
        id: 'list-blue',
        status: 'FINISHED',
        correctCount: 9,
        totalQuestions: 10,
      }),
    ]

    render(
      <ExerciseListsTable
        exerciseLists={lists}
        onDelete={vi.fn()}
        onCreateNew={vi.fn()}
        hasActiveFilters={false}
      />,
    )

    const badge = screen.getByText('90% (9/10)')
    expect(badge.className).toContain('bg-blue-100')
  })
})
