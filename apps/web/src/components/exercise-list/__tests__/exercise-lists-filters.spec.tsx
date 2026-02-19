import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseListsFilters } from '../exercise-lists-filters'

const mockPush = vi.fn()
let mockSearchParams = new URLSearchParams()

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
  usePathname: () => '/listas',
  useSearchParams: () => mockSearchParams,
}))

describe('ExerciseListsFilters', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockSearchParams = new URLSearchParams()
  })

  it('deve renderizar todos os controles de filtro', () => {
    render(<ExerciseListsFilters />)

    expect(
      screen.getByPlaceholderText('Buscar por nome...'),
    ).toBeInTheDocument()
    expect(screen.getByText('Status')).toBeInTheDocument()
    expect(screen.getByText('Período de criação')).toBeInTheDocument()
  })

  it('deve atualizar URL quando o filtro de status muda', async () => {
    const user = userEvent.setup()
    render(<ExerciseListsFilters />)

    const statusSelect = screen.getByDisplayValue('Todos')
    await user.selectOptions(statusSelect, 'FINISHED')

    expect(mockPush).toHaveBeenCalledWith('/listas?status=FINISHED')
  })

  it('deve preservar filtros existentes ao alterar outro', async () => {
    mockSearchParams = new URLSearchParams('search=math')
    const user = userEvent.setup()
    render(<ExerciseListsFilters />)

    const statusSelect = screen.getByDisplayValue('Todos')
    await user.selectOptions(statusSelect, 'PENDING')

    expect(mockPush).toHaveBeenCalledWith(
      '/listas?search=math&status=PENDING',
    )
  })

  it('deve resetar a página ao alterar filtros', async () => {
    mockSearchParams = new URLSearchParams('page=3&status=FINISHED')
    const user = userEvent.setup()
    render(<ExerciseListsFilters />)

    const statusSelect = screen.getByLabelText('Status')
    await user.selectOptions(statusSelect, 'PENDING')

    expect(mockPush).toHaveBeenCalledWith(
      expect.not.stringContaining('page='),
    )
  })

  it('não deve mostrar botão de limpar filtros quando não há filtros ativos', () => {
    render(<ExerciseListsFilters />)

    expect(screen.queryByText('Limpar filtros')).not.toBeInTheDocument()
  })

  it('deve mostrar botão de limpar filtros e limpar ao clicar', async () => {
    mockSearchParams = new URLSearchParams('status=FINISHED&search=math')
    const user = userEvent.setup()
    render(<ExerciseListsFilters />)

    const clearButton = screen.getByText('Limpar filtros')
    expect(clearButton).toBeInTheDocument()

    await user.click(clearButton)

    expect(mockPush).toHaveBeenCalledWith('/listas')
  })

  it('deve remover param quando select volta para Todos', async () => {
    mockSearchParams = new URLSearchParams('status=FINISHED')
    const user = userEvent.setup()
    render(<ExerciseListsFilters />)

    const statusSelect = screen.getByLabelText('Status')
    await user.selectOptions(statusSelect, '')

    expect(mockPush).toHaveBeenCalledWith('/listas')
  })
})
