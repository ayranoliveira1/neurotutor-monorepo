import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { usePlansAdminQuery } from '../use-plans-admin-query'

vi.mock('@/actions/admin/list-plans-admin', () => ({
  listPlansAdminAction: vi.fn(),
}))

import { listPlansAdminAction } from '@/actions/admin/list-plans-admin'

const mockListPlansAdmin = vi.mocked(listPlansAdminAction)

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
    cycle: 'MONTHLY',
    active: true,
    canDelete: true,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

describe('usePlansAdminQuery', () => {
  it('should call listPlansAdminAction', async () => {
    mockListPlansAdmin.mockResolvedValueOnce(mockPlans)

    const { result } = renderHook(() => usePlansAdminQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListPlansAdmin).toHaveBeenCalled()
  })

  it('should return plans on success', async () => {
    mockListPlansAdmin.mockResolvedValueOnce(mockPlans)

    const { result } = renderHook(() => usePlansAdminQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockPlans)
  })

  it('should return error on failure', async () => {
    mockListPlansAdmin.mockRejectedValueOnce(
      new Error('Erro ao listar planos')
    )

    const { result } = renderHook(() => usePlansAdminQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao listar planos')
  })
})
