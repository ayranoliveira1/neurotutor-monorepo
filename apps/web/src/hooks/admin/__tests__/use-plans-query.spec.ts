import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { usePlansQuery } from '../use-plans-query'

vi.mock('@/actions/admin/planos/list-plans', () => ({
  listPlansAction: vi.fn(),
}))

import { listPlansAction } from '@/actions/admin/planos/list-plans'

const mockListPlans = vi.mocked(listPlansAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockPlans = [
  {
    id: '1',
    name: 'Plano Pro',
    slug: 'pro',
    priceCents: 4990,
    cycle: 'Monthly',
    active: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

describe('usePlansQuery', () => {
  it('should call listPlansAction', async () => {
    mockListPlans.mockResolvedValueOnce(mockPlans)

    const { result } = renderHook(() => usePlansQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListPlans).toHaveBeenCalled()
  })

  it('should return plans on success', async () => {
    mockListPlans.mockResolvedValueOnce(mockPlans)

    const { result } = renderHook(() => usePlansQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockPlans)
  })

  it('should return error on failure', async () => {
    mockListPlans.mockRejectedValueOnce(new Error('Erro ao listar planos'))

    const { result } = renderHook(() => usePlansQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao listar planos')
  })
})
