import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useStudyPlansQuery } from '../use-study-plans-query'

vi.mock('@/actions/study-plan/fetch-study-plans', () => ({
  fetchStudyPlansAction: vi.fn(),
}))

import { fetchStudyPlansAction } from '@/actions/study-plan/fetch-study-plans'

const mockFetchPlans = vi.mocked(fetchStudyPlansAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockData = {
  studyPlans: [],
  totalPages: 1,
  currentPage: 1,
  totalItems: 0,
}

describe('useStudyPlansQuery', () => {
  it('deve chamar fetchStudyPlansAction com params padrão', async () => {
    mockFetchPlans.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useStudyPlansQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchPlans).toHaveBeenCalledWith({})
  })

  it('deve passar parâmetros de paginação', async () => {
    mockFetchPlans.mockResolvedValueOnce(mockData)

    const { result } = renderHook(
      () => useStudyPlansQuery({ page: 2, perPage: 10 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchPlans).toHaveBeenCalledWith({ page: 2, perPage: 10 })
  })

  it('deve passar filtro de status', async () => {
    mockFetchPlans.mockResolvedValueOnce(mockData)

    const { result } = renderHook(
      () => useStudyPlansQuery({ page: 1, perPage: 9, status: 'ACTIVE' }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchPlans).toHaveBeenCalledWith({
      page: 1,
      perPage: 9,
      status: 'ACTIVE',
    })
  })

  it('deve retornar dados com sucesso', async () => {
    mockFetchPlans.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useStudyPlansQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
  })
})
