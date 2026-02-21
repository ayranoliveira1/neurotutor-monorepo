import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { QuestionsFilters } from '../questions-filters'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  usePathname: () => '/admin/questoes',
  useSearchParams: () => new URLSearchParams(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQuery: ({ queryKey }: { queryKey: string[] }) => {
    if (queryKey.includes('subjects')) {
      return { data: ['Matemática', 'Português'] }
    }
    if (queryKey.includes('years')) {
      return { data: [2024, 2025] }
    }
    if (queryKey.includes('difficulties')) {
      return { data: ['EASY', 'MEDIUM', 'HARD'] }
    }
    return { data: null }
  },
}))

vi.mock('@/actions/exercise-list/fetch-subjects', () => ({
  fetchSubjectsAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/fetch-years', () => ({
  fetchYearsAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/fetch-difficulties', () => ({
  fetchDifficultiesAction: vi.fn(),
}))

vi.mock('@/components/ui/select', () => ({
  Select: ({
    options,
    value,
    onChange,
  }: {
    options: { value: string; label: string }[]
    value: string
    onChange: (e: { target: { value: string } }) => void
  }) => (
    <select
      value={value}
      onChange={(e) => onChange({ target: { value: e.target.value } })}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  ),
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

vi.mock('@/components/ui/label', () => ({
  Label: ({
    children,
    ...props
  }: {
    children: React.ReactNode
    className?: string
  }) => <label {...props}>{children}</label>,
}))

describe('QuestionsFilters', () => {
  it('deve renderizar labels dos filtros', () => {
    render(<QuestionsFilters />)
    expect(screen.getByText('Disciplina')).toBeInTheDocument()
    expect(screen.getByText('Ano')).toBeInTheDocument()
    expect(screen.getByText('Dificuldade')).toBeInTheDocument()
  })

  it('deve renderizar opções de disciplina', () => {
    render(<QuestionsFilters />)
    expect(screen.getAllByText('Todas').length).toBeGreaterThanOrEqual(1)
    expect(screen.getByText('Matemática')).toBeInTheDocument()
    expect(screen.getByText('Português')).toBeInTheDocument()
  })

  it('deve renderizar opções de ano', () => {
    render(<QuestionsFilters />)
    expect(screen.getByText('Todos')).toBeInTheDocument()
    expect(screen.getByText('2024')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
  })

  it('deve renderizar opções de dificuldade', () => {
    render(<QuestionsFilters />)
    expect(screen.getByText('Fácil')).toBeInTheDocument()
    expect(screen.getByText('Médio')).toBeInTheDocument()
    expect(screen.getByText('Difícil')).toBeInTheDocument()
  })

  it('não deve renderizar botão limpar filtros sem filtros ativos', () => {
    render(<QuestionsFilters />)
    expect(
      screen.queryByText('Limpar filtros'),
    ).not.toBeInTheDocument()
  })
})
