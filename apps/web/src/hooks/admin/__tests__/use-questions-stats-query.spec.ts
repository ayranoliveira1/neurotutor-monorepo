import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useQuestionsStatsQuery } from '../use-questions-stats-query'

vi.mock('@/actions/admin/questoes/get-questions-stats', () => ({
  getQuestionsStatsAction: vi.fn(),
}))

import { getQuestionsStatsAction } from '@/actions/admin/questoes/get-questions-stats'

const mockGetStats = vi.mocked(getQuestionsStatsAction)

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
  total: 150,
  bySubject: [
    { subject: 'Matemática', count: 80 },
    { subject: 'Português', count: 70 },
  ],
}

describe('useQuestionsStatsQuery', () => {
  it('deve chamar getQuestionsStatsAction', async () => {
    mockGetStats.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useQuestionsStatsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetStats).toHaveBeenCalled()
  })

  it('deve retornar dados no sucesso', async () => {
    mockGetStats.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useQuestionsStatsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('deve retornar erro no falha', async () => {
    mockGetStats.mockRejectedValueOnce(
      new Error('Erro ao buscar estatísticas'),
    )

    const { result } = renderHook(() => useQuestionsStatsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao buscar estatísticas')
  })
})
