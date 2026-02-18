import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseListResultQuery } from '../use-exercise-list-result-query'

vi.mock('@/actions/exercise-list/get-exercise-list-result', () => ({
  getExerciseListResultAction: vi.fn(),
}))

import { getExerciseListResultAction } from '@/actions/exercise-list/get-exercise-list-result'

const mockGetResult = vi.mocked(getExerciseListResultAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockData = {
  exerciseList: {
    id: 'list-1',
    name: 'Lista Teste',
    shuffleQuestions: false,
    ignoreAnswered: false,
    sections: [],
    totalQuestions: 10,
    status: 'FINISHED' as const,
    correctCount: 7,
    totalTimeSeconds: null,
    avgTimePerQuestion: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  questions: [],
  answers: [],
}

describe('useExerciseListResultQuery', () => {
  it('deve chamar getExerciseListResultAction com o id', async () => {
    mockGetResult.mockResolvedValueOnce(mockData)

    const { result } = renderHook(
      () => useExerciseListResultQuery('list-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetResult).toHaveBeenCalledWith('list-1')
  })

  it('deve retornar dados com sucesso', async () => {
    mockGetResult.mockResolvedValueOnce(mockData)

    const { result } = renderHook(
      () => useExerciseListResultQuery('list-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
  })

  it('deve retornar erro em caso de falha', async () => {
    mockGetResult.mockRejectedValueOnce(
      new Error('Erro ao carregar resultado'),
    )

    const { result } = renderHook(
      () => useExerciseListResultQuery('list-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('Erro ao carregar resultado')
  })
})
