import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useUsersQuery } from '../use-users-query'

vi.mock('@/actions/admin/usuarios/list-users', () => ({
  listUsersAction: vi.fn(),
}))

import { listUsersAction } from '@/actions/admin/usuarios/list-users'

const mockListUsers = vi.mocked(listUsersAction)

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
  users: [
    {
      id: '1',
      name: 'Maria Silva',
      email: 'maria@email.com',
      image: null,
      role: 'ADMIN',
      emailVerified: true,
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z',
      subscription: null,
    },
  ],
  totalItems: 1,
  totalPages: 1,
  currentPage: 1,
  offset: 0,
}

describe('useUsersQuery', () => {
  it('should call listUsersAction with given params', async () => {
    mockListUsers.mockResolvedValueOnce(mockResponse)

    const params = { page: 1, perPage: 20, search: 'maria' }
    const { result } = renderHook(() => useUsersQuery(params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListUsers).toHaveBeenCalledWith(params)
  })

  it('should return data on success', async () => {
    mockListUsers.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(() => useUsersQuery({ page: 1 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('should return error on failure', async () => {
    mockListUsers.mockRejectedValueOnce(new Error('Erro ao listar usuários'))

    const { result } = renderHook(() => useUsersQuery({ page: 1 }), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao listar usuários')
  })
})
