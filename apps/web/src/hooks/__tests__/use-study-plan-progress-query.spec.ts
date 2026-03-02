import { describe, it, expect, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useStudyPlanProgressQuery } from '../use-study-plan-progress-query'

vi.mock('@/actions/study-plan/get-study-plan-progress', () => ({
  getStudyPlanProgressAction: vi.fn(),
}))

import { getStudyPlanProgressAction } from '@/actions/study-plan/get-study-plan-progress'

const mockGetProgress = vi.mocked(getStudyPlanProgressAction)

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

const mockProgressData = {
  studyPlan: {
    id: 'plan-1',
    name: 'Plano ENEM',
    description: null,
    status: 'ACTIVE' as const,
    startDate: '2026-01-01',
    endDate: '2026-06-01',
    goals: [],
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  goalsProgress: [],
  overall: {
    totalQuestions: 50,
    totalCorrect: 35,
    avgAccuracy: 70,
    daysRemaining: 90,
    daysElapsed: 60,
    totalDays: 150,
  },
}

describe('useStudyPlanProgressQuery', () => {
  it('deve buscar progresso do plano', async () => {
    mockGetProgress.mockResolvedValueOnce(mockProgressData)

    const { result } = renderHook(
      () => useStudyPlanProgressQuery('plan-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockGetProgress).toHaveBeenCalledWith('plan-1')
    expect(result.current.data).toEqual(mockProgressData)
  })

  it('deve lidar com erro', async () => {
    mockGetProgress.mockRejectedValueOnce(new Error('Erro'))

    const { result } = renderHook(
      () => useStudyPlanProgressQuery('plan-1'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
