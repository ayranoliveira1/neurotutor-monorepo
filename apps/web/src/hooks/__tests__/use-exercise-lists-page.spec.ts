import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseListsPage } from '../use-exercise-lists-page'

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}))

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}))

vi.mock('@/actions/exercise-list/fetch-exercise-lists', () => ({
  fetchExerciseListsAction: vi.fn(),
}))

import { useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { fetchExerciseListsAction } from '@/actions/exercise-list/fetch-exercise-lists'

const mockUseSearchParams = vi.mocked(useSearchParams)
const mockFetchLists = vi.mocked(fetchExerciseListsAction)

const mockData = {
  exerciseLists: [
    {
      id: '1',
      name: 'Lista 1',
      shuffleQuestions: false,
      ignoreAnswered: false,
      sections: [],
      totalQuestions: 10,
      status: 'PENDING' as const,
      correctCount: null,
      totalTimeSeconds: null,
      avgTimePerQuestion: null,
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
    },
  ],
  totalPages: 2,
  currentPage: 1,
  totalItems: 15,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
  mockUseSearchParams.mockReturnValue(new URLSearchParams() as never)
  mockFetchLists.mockResolvedValue(mockData)
})

describe('useExerciseListsPage', () => {
  it('deve retornar valores padrão quando não há dados', () => {
    mockFetchLists.mockResolvedValue(undefined as never)

    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.exerciseLists).toEqual([])
    expect(result.current.totalPages).toBe(0)
    expect(result.current.currentPage).toBe(1)
    expect(result.current.totalItems).toBe(0)
  })

  it('deve ler a página dos searchParams', () => {
    mockUseSearchParams.mockReturnValue(
      new URLSearchParams('page=3') as never,
    )

    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    expect(mockFetchLists).toHaveBeenCalledWith({ page: 3, perPage: 9 })
    expect(result.current).toBeDefined()
  })

  it('deve controlar createOpen com openCreateDialog', () => {
    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.createOpen).toBe(false)

    act(() => result.current.openCreateDialog())

    expect(result.current.createOpen).toBe(true)
  })

  it('deve controlar deleteItem com setDeleteItem e closeDeleteDialog', () => {
    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    expect(result.current.deleteItem).toBeNull()

    const item = { id: '1', name: 'Lista 1' } as never
    act(() => result.current.setDeleteItem(item))

    expect(result.current.deleteItem).toEqual(item)

    act(() => result.current.closeDeleteDialog())

    expect(result.current.deleteItem).toBeNull()
  })

  it('deve exibir toast e fechar dialog ao criar com sucesso', () => {
    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    act(() => result.current.openCreateDialog())
    expect(result.current.createOpen).toBe(true)

    act(() => result.current.handleCreateSuccess())

    expect(toast.success).toHaveBeenCalledWith(
      'Lista de exercícios criada com sucesso',
    )
    expect(result.current.createOpen).toBe(false)
  })

  it('deve exibir toast e limpar deleteItem ao excluir com sucesso', () => {
    const { result } = renderHook(() => useExerciseListsPage(), {
      wrapper: createWrapper(),
    })

    const item = { id: '1', name: 'Lista 1' } as never
    act(() => result.current.setDeleteItem(item))

    act(() => result.current.handleDeleteSuccess())

    expect(toast.success).toHaveBeenCalledWith(
      'Lista de exercícios excluída com sucesso',
    )
    expect(result.current.deleteItem).toBeNull()
  })
})
