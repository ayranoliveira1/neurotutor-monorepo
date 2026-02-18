import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import {
  useSubjectsQuery,
  useOriginsQuery,
  useCategoriesQuery,
} from '../use-questions-metadata-query'

vi.mock('@/actions/exercise-list/fetch-subjects', () => ({
  fetchSubjectsAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/fetch-origins', () => ({
  fetchOriginsAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/fetch-categories', () => ({
  fetchCategoriesAction: vi.fn(),
}))

import { fetchSubjectsAction } from '@/actions/exercise-list/fetch-subjects'
import { fetchOriginsAction } from '@/actions/exercise-list/fetch-origins'
import { fetchCategoriesAction } from '@/actions/exercise-list/fetch-categories'

const mockFetchSubjects = vi.mocked(fetchSubjectsAction)
const mockFetchOrigins = vi.mocked(fetchOriginsAction)
const mockFetchCategories = vi.mocked(fetchCategoriesAction)

beforeEach(() => {
  vi.clearAllMocks()
})

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

describe('useSubjectsQuery', () => {
  it('deve chamar fetchSubjectsAction', async () => {
    mockFetchSubjects.mockResolvedValueOnce(['Matemática', 'Português'])

    const { result } = renderHook(() => useSubjectsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchSubjects).toHaveBeenCalled()
    expect(result.current.data).toEqual(['Matemática', 'Português'])
  })
})

describe('useOriginsQuery', () => {
  it('deve chamar fetchOriginsAction', async () => {
    mockFetchOrigins.mockResolvedValueOnce(['ENEM', 'FUVEST'])

    const { result } = renderHook(() => useOriginsQuery(), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchOrigins).toHaveBeenCalled()
    expect(result.current.data).toEqual(['ENEM', 'FUVEST'])
  })
})

describe('useCategoriesQuery', () => {
  it('deve chamar fetchCategoriesAction quando subject é fornecido', async () => {
    mockFetchCategories.mockResolvedValueOnce(['Álgebra', 'Geometria'])

    const { result } = renderHook(
      () => useCategoriesQuery('Matemática'),
      { wrapper: createWrapper() },
    )

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(mockFetchCategories).toHaveBeenCalledWith('Matemática')
    expect(result.current.data).toEqual(['Álgebra', 'Geometria'])
  })

  it('não deve executar query quando subject é undefined', async () => {
    const { result } = renderHook(() => useCategoriesQuery(undefined), {
      wrapper: createWrapper(),
    })

    expect(result.current.fetchStatus).toBe('idle')
    expect(mockFetchCategories).not.toHaveBeenCalled()
  })
})
