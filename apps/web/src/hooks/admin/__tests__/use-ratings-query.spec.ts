import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useRatingsQuery } from '../use-ratings-query'

vi.mock('@/actions/admin/list-ratings', () => ({
  listRatingsAction: vi.fn(),
}))

import { listRatingsAction } from '@/actions/admin/list-ratings'

const mockListRatings = vi.mocked(listRatingsAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockResponse = {
  ratings: [
    {
      id: '1',
      userId: 'user-1',
      rating: 5,
      description: 'Excelente plataforma!',
      userName: 'Maria Silva',
      userEmail: 'maria@email.com',
      createdAt: '2025-01-15T00:00:00.000Z',
    },
  ],
  totalItems: 1,
  totalPages: 1,
  currentPage: 1,
}

describe('useRatingsQuery', () => {
  it('should call listRatingsAction with given params', async () => {
    mockListRatings.mockResolvedValueOnce(mockResponse)

    const params = { page: 1, perPage: 10 }
    const { result } = renderHook(() => useRatingsQuery(params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListRatings).toHaveBeenCalledWith(params)
  })

  it('should return data on success', async () => {
    mockListRatings.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useRatingsQuery({ page: 1 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('should return error on failure', async () => {
    mockListRatings.mockRejectedValueOnce(
      new Error('Erro ao listar avaliações'),
    )

    const { result } = renderHook(() => useRatingsQuery({ page: 1 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao listar avaliações')
  })
})
