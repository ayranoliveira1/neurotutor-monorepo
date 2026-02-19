import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseListsQuery } from '../use-exercise-lists-query'

vi.mock('@/actions/exercise-list/fetch-exercise-lists', () => ({
  fetchExerciseListsAction: vi.fn(),
}))

import { fetchExerciseListsAction } from '@/actions/exercise-list/fetch-exercise-lists'

const mockFetchLists = vi.mocked(fetchExerciseListsAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockData = {
  exerciseLists: [],
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
}

describe('useExerciseListsQuery', () => {
  it('deve chamar fetchExerciseListsAction com params padrão', async () => {
    mockFetchLists.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useExerciseListsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchLists).toHaveBeenCalledWith({})
  })

  it('deve passar parâmetros de paginação', async () => {
    mockFetchLists.mockResolvedValueOnce(mockData)

    const { result } = renderHook(
      () => useExerciseListsQuery({ page: 2, perPage: 10 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchLists).toHaveBeenCalledWith({ page: 2, perPage: 10 })
  })

  it('deve passar parâmetros de filtro', async () => {
    mockFetchLists.mockResolvedValueOnce(mockData)

    const params = {
      page: 1,
      perPage: 9,
      search: 'matemática',
      status: 'FINISHED',
      startDate: '2025-01-01',
      endDate: '2025-12-31',
    }

    const { result } = renderHook(
      () => useExerciseListsQuery(params),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchLists).toHaveBeenCalledWith(params)
  })

  it('deve retornar dados com sucesso', async () => {
    mockFetchLists.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useExerciseListsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
  })
})
