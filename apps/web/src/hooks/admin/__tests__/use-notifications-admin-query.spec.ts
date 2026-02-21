import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useNotificationsAdminQuery } from '../use-notifications-admin-query'

vi.mock('@/actions/admin/notificacoes/list-notifications', () => ({
  listNotificationsAction: vi.fn(),
}))

import { listNotificationsAction } from '@/actions/admin/notificacoes/list-notifications'

const mockListNotifications = vi.mocked(listNotificationsAction)

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
      title: 'Aviso importante',
      content: 'Conteúdo do aviso',
      destination: {
        sendIds: [{ userId: 'user-1', readAt: null }],
      },
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: null,
    },
  ],
  totalItems: 1,
  totalPages: 1,
  currentPage: 1,
}

describe('useNotificationsAdminQuery', () => {
  it('should call listNotificationsAction with given params', async () => {
    mockListNotifications.mockResolvedValueOnce(mockResponse)

    const params = { page: 1, perPage: 10 }
    const { result } = renderHook(
      () => useNotificationsAdminQuery(params),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListNotifications).toHaveBeenCalledWith(params)
  })

  it('should return data on success', async () => {
    mockListNotifications.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(
      () => useNotificationsAdminQuery({ page: 1 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('should return error on failure', async () => {
    mockListNotifications.mockRejectedValueOnce(
      new Error('Erro ao listar notificações'),
    )

    const { result } = renderHook(
      () => useNotificationsAdminQuery({ page: 1 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe(
      'Erro ao listar notificações',
    )
  })
})
