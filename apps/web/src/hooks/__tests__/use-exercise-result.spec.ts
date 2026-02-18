import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseResult } from '../use-exercise-result'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

vi.mock('@/actions/exercise-list/get-exercise-list-result', () => ({
  getExerciseListResultAction: vi.fn(),
}))

import { getExerciseListResultAction } from '@/actions/exercise-list/get-exercise-list-result'

const mockGetResult = vi.mocked(getExerciseListResultAction)

const mockQuestions = [
  {
    id: 'q1',
    externalId: 'ext-1',
    subject: 'Matemática',
    statement: '<p>Questão 1</p>',
    imageUrl: null,
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM',
    categories: [],
    correctAnswer: 2,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'q2',
    externalId: 'ext-2',
    subject: 'Português',
    statement: '<p>Questão 2</p>',
    imageUrl: null,
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM',
    categories: [],
    correctAnswer: 0,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

const mockAnswers = [
  {
    id: 'ans-1',
    exerciseListId: 'list-1',
    questionId: 'q1',
    selectedAnswer: 2,
    isCorrect: true,
    timeSpentSeconds: 30,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'ans-2',
    exerciseListId: 'list-1',
    questionId: 'q2',
    selectedAnswer: 1,
    isCorrect: false,
    timeSpentSeconds: 45,
    createdAt: '2025-01-01T00:00:00.000Z',
  },
]

const mockData = {
  exerciseList: {
    id: 'list-1',
    name: 'Minha Lista',
    shuffleQuestions: false,
    ignoreAnswered: false,
    sections: [],
    totalQuestions: 2,
    status: 'FINISHED' as const,
    correctCount: 1,
    totalTimeSeconds: 75,
    avgTimePerQuestion: 38,
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  questions: mockQuestions,
  answers: mockAnswers,
}

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })
  return ({ children }: { children: React.ReactNode }) =>
    createElement(QueryClientProvider, { client: queryClient }, children)
}

beforeEach(() => {
  vi.clearAllMocks()
  mockGetResult.mockResolvedValue(mockData)
})

describe('useExerciseResult', () => {
  it('deve retornar dados do resultado', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.exerciseList).toEqual(mockData.exerciseList)
    expect(result.current.questions).toEqual(mockQuestions)
    expect(result.current.answers).toEqual(mockAnswers)
  })

  it('deve calcular a porcentagem corretamente', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.correctCount).toBe(1)
    expect(result.current.totalQuestions).toBe(2)
    expect(result.current.percentage).toBe(50)
  })

  it('deve criar answersMap a partir das respostas', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.answersMap).toEqual({
      q1: mockAnswers[0],
      q2: mockAnswers[1],
    })
  })

  it('deve navegar entre questões', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.currentIndex).toBe(0)
    expect(result.current.currentQuestion).toEqual(mockQuestions[0])
    expect(result.current.currentAnswer).toEqual(mockAnswers[0])

    act(() => result.current.goNext())
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.currentQuestion).toEqual(mockQuestions[1])
    expect(result.current.currentAnswer).toEqual(mockAnswers[1])
  })

  it('não deve passar do último índice com goNext', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goNext())
    act(() => result.current.goNext())
    expect(result.current.currentIndex).toBe(1)
  })

  it('não deve passar do índice 0 com goPrev', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goPrev())
    expect(result.current.currentIndex).toBe(0)
  })

  it('deve ir para questão específica com goToQuestion', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goToQuestion(1))
    expect(result.current.currentIndex).toBe(1)
    expect(result.current.currentQuestion).toEqual(mockQuestions[1])
  })

  it('deve revelar resposta de uma questão', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isQuestionRevealed('q1')).toBe(false)

    act(() => result.current.revealAnswer('q1'))

    expect(result.current.isQuestionRevealed('q1')).toBe(true)
    expect(result.current.isQuestionRevealed('q2')).toBe(false)
  })

  it('deve navegar para /listas ao chamar goBack', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goBack())
    expect(mockPush).toHaveBeenCalledWith('/listas')
  })

  it('deve calcular totalTimeSeconds e avgTimePerQuestion', async () => {
    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.totalTimeSeconds).toBe(75)
    expect(result.current.avgTimePerQuestion).toBe(38)
  })

  it('deve retornar valores padrão quando não há dados', () => {
    mockGetResult.mockResolvedValue(undefined as never)

    const { result } = renderHook(() => useExerciseResult('list-1'), {
      wrapper: createWrapper(),
    })

    expect(result.current.exerciseList).toBeNull()
    expect(result.current.questions).toEqual([])
    expect(result.current.answers).toEqual([])
    expect(result.current.percentage).toBe(0)
  })
})
