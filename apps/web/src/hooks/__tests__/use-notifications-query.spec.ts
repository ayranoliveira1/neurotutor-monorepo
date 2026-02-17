import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useNotificationsQuery } from '../use-notifications-query'

vi.mock('@/actions/notifications/fetch-notifications', () => ({
  fetchNotificationsAction: vi.fn(),
}))

import { fetchNotificationsAction } from '@/actions/notifications/fetch-notifications'

const mockFetch = vi.mocked(fetchNotificationsAction)

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
  notifications: [
    {
      id: 'notif-1',
      title: 'Nova funcionalidade',
      content: 'Confira a nova funcionalidade!',
      destination: {
        sendIds: [{ userId: 'user-1', readAt: null }],
      },
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: null,
    },
  ],
}

describe('useNotificationsQuery', () => {
  it('should call fetchNotificationsAction', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useNotificationsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetch).toHaveBeenCalled()
  })

  it('should return data on success', async () => {
    mockFetch.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useNotificationsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('should return error on failure', async () => {
    mockFetch.mockRejectedValueOnce(
      new Error('Erro ao buscar notificações'),
    )

    const { result } = renderHook(() => useNotificationsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao buscar notificações')
  })
})
