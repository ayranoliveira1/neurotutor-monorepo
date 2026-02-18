import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseListQuery } from '../use-exercise-list-query'

vi.mock('@/actions/exercise-list/get-exercise-list', () => ({
  getExerciseListAction: vi.fn(),
}))

import { getExerciseListAction } from '@/actions/exercise-list/get-exercise-list'

const mockGetExerciseList = vi.mocked(getExerciseListAction)

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
    name: 'Lista de Matemática',
    shuffleQuestions: false,
    ignoreAnswered: false,
    sections: [],
    totalQuestions: 0,
    status: 'PENDING' as const,
    correctCount: null,
    totalTimeSeconds: null,
    avgTimePerQuestion: null,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  questions: [],
  answeredMap: {},
  timeMap: {},
}

describe('useExerciseListQuery', () => {
  it('deve chamar getExerciseListAction com o id', async () => {
    mockGetExerciseList.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useExerciseListQuery('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetExerciseList).toHaveBeenCalledWith('list-1')
  })

  it('deve retornar dados com sucesso', async () => {
    mockGetExerciseList.mockResolvedValueOnce(mockData)

    const { result } = renderHook(() => useExerciseListQuery('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.data).toEqual(mockData)
  })

  it('deve retornar erro em caso de falha', async () => {
    mockGetExerciseList.mockRejectedValueOnce(
      new Error('Erro ao carregar lista'),
    )

    const { result } = renderHook(() => useExerciseListQuery('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isError).toBe(true))

    expect(result.current.error?.message).toBe('Erro ao carregar lista')
  })
})
