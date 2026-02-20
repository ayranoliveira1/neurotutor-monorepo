import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useQuestionsListQuery } from '../use-questions-list-query'

vi.mock('@/actions/admin/list-questions', () => ({
  listQuestionsAction: vi.fn(),
}))

import { listQuestionsAction } from '@/actions/admin/list-questions'

const mockListQuestions = vi.mocked(listQuestionsAction)

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
  questions: [
    {
      id: '1',
      externalId: 'ENEM-2025-001',
      statement: 'Questão exemplo',
      alternatives: ['A', 'B', 'C'],
      origin: 'ENEM',
      subject: 'Matemática',
      categories: [],
      correctAnswer: 0,
      year: 2025,
      difficulty: 'EASY',
      imageUrl: null,
      createdAt: '2025-01-15T00:00:00.000Z',
      updatedAt: '2025-01-15T00:00:00.000Z',
    },
  ],
  totalItems: 1,
  totalPages: 1,
  currentPage: 1,
  offset: 0,
}

describe('useQuestionsListQuery', () => {
  it('deve chamar listQuestionsAction com os params', async () => {
    mockListQuestions.mockResolvedValueOnce(mockResponse)

    const params = { page: 1, perPage: 10, subject: 'Matemática' }
    const { result } = renderHook(() => useQuestionsListQuery(params), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockListQuestions).toHaveBeenCalledWith(params)
  })

  it('deve retornar dados no sucesso', async () => {
    mockListQuestions.mockResolvedValueOnce(mockResponse)

    const { result } = renderHook(
      () => useQuestionsListQuery({ page: 1, perPage: 10 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockResponse)
  })

  it('deve retornar erro no falha', async () => {
    mockListQuestions.mockRejectedValueOnce(
      new Error('Erro ao listar questões'),
    )

    const { result } = renderHook(
      () => useQuestionsListQuery({ page: 1, perPage: 10 }),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Erro ao listar questões')
  })
})
