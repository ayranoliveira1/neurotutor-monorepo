import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useQuestionDetailQuery } from '../use-question-detail-query'

vi.mock('@/actions/admin/get-question', () => ({
  getQuestionAction: vi.fn(),
}))

import { getQuestionAction } from '@/actions/admin/get-question'

const mockGetQuestion = vi.mocked(getQuestionAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockQuestion = {
  id: 'question-1',
  externalId: 'ENEM-2025-001',
  statement: 'Qual a capital do Brasil?',
  alternatives: ['São Paulo', 'Brasília', 'Rio de Janeiro'],
  origin: 'ENEM',
  subject: 'Geografia',
  categories: ['Capitais'],
  correctAnswer: 1,
  year: 2025,
  difficulty: 'EASY',
  imageUrl: null,
  createdAt: '2025-01-15T00:00:00.000Z',
  updatedAt: '2025-01-15T00:00:00.000Z',
}

describe('useQuestionDetailQuery', () => {
  it('deve chamar getQuestionAction com o id', async () => {
    mockGetQuestion.mockResolvedValueOnce(mockQuestion)

    const { result } = renderHook(
      () => useQuestionDetailQuery('question-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetQuestion).toHaveBeenCalledWith('question-1')
  })

  it('deve retornar dados no sucesso', async () => {
    mockGetQuestion.mockResolvedValueOnce(mockQuestion)

    const { result } = renderHook(
      () => useQuestionDetailQuery('question-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockQuestion)
  })

  it('deve retornar erro no falha', async () => {
    mockGetQuestion.mockRejectedValueOnce(
      new Error('Questão não encontrada'),
    )

    const { result } = renderHook(
      () => useQuestionDetailQuery('non-existent'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error).toBeInstanceOf(Error)
    expect(result.current.error?.message).toBe('Questão não encontrada')
  })
})
