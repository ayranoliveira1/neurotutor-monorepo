import { describe, it, expect, vi, beforeEach } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createElement } from 'react'
import { useExerciseResolve } from '../use-exercise-resolve'

const mockPush = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockPush }),
}))

const mockExecuteAnswer = vi.fn()
const mockExecuteFinish = vi.fn()
vi.mock('next-safe-action/hooks', () => ({
  useAction: vi.fn((_, opts) => {
    const isFinish = opts?.onSuccess
    if (isFinish && opts.onError) {
      return {
        execute: mockExecuteFinish,
        isPending: false,
      }
    }
    return {
      execute: mockExecuteAnswer,
      isPending: false,
    }
  }),
}))

vi.mock('sonner', () => ({
  toast: { error: vi.fn() },
}))

vi.mock('@/actions/exercise-list/answer-question', () => ({
  answerQuestionAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/finish-exercise-list', () => ({
  finishExerciseListAction: vi.fn(),
}))

vi.mock('@/actions/exercise-list/get-exercise-list', () => ({
  getExerciseListAction: vi.fn(),
}))

import { getExerciseListAction } from '@/actions/exercise-list/get-exercise-list'

const mockGetExerciseList = vi.mocked(getExerciseListAction)

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
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'q2',
    externalId: 'ext-2',
    subject: 'Matemática',
    statement: '<p>Questão 2</p>',
    imageUrl: null,
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM',
    categories: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
  {
    id: 'q3',
    externalId: 'ext-3',
    subject: 'Português',
    statement: '<p>Questão 3</p>',
    imageUrl: null,
    alternatives: ['A', 'B', 'C', 'D'],
    origin: 'ENEM',
    categories: [],
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
  },
]

const mockExerciseList = {
  id: 'list-1',
  name: 'Minha Lista',
  shuffleQuestions: false,
  ignoreAnswered: false,
  sections: [],
  totalQuestions: 3,
  status: 'IN_PROGRESS' as const,
  correctCount: null,
  totalTimeSeconds: null,
  avgTimePerQuestion: null,
  createdAt: '2025-01-01T00:00:00.000Z',
  updatedAt: '2025-01-01T00:00:00.000Z',
}

const mockData = {
  exerciseList: mockExerciseList,
  questions: mockQuestions,
  answeredMap: {},
  timeMap: {},
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
  mockGetExerciseList.mockResolvedValue(mockData)
})

describe('useExerciseResolve', () => {
  it('deve iniciar no índice 0', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.currentIndex).toBe(0)
    expect(result.current.currentQuestion).toEqual(mockQuestions[0])
  })

  it('deve retornar dados da lista de exercícios', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.exerciseList).toEqual(mockData.exerciseList)
    expect(result.current.questions).toEqual(mockQuestions)
    expect(result.current.totalQuestions).toBe(3)
  })

  it('deve navegar entre questões com goNext e goPrev', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goNext())
    expect(result.current.currentIndex).toBe(1)

    act(() => result.current.goNext())
    expect(result.current.currentIndex).toBe(2)

    act(() => result.current.goPrev())
    expect(result.current.currentIndex).toBe(1)
  })

  it('deve ir para questão específica com goToQuestion', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goToQuestion(2))
    expect(result.current.currentIndex).toBe(2)
    expect(result.current.currentQuestion).toEqual(mockQuestions[2])
  })

  it('deve salvar resposta localmente ao selecionar alternativa', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.handleSelectAnswer('q1', 2))

    expect(result.current.mergedAnswers).toHaveProperty('q1', 2)
    expect(result.current.answeredCount).toBe(1)
  })

  it('deve enviar timeSpentSeconds ao responder', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.handleSelectAnswer('q1', 2))

    expect(mockExecuteAnswer).toHaveBeenCalledWith(
      expect.objectContaining({
        exerciseListId: 'list-1',
        questionId: 'q1',
        selectedAnswer: 2,
        timeSpentSeconds: expect.any(Number),
      }),
    )
  })

  it('deve expor getTimeForQuestion', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(typeof result.current.getTimeForQuestion).toBe('function')
    expect(result.current.getTimeForQuestion('q1')).toBeGreaterThanOrEqual(0)
  })

  it('deve mostrar revisão ao avançar na última questão', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.showReview).toBe(false)

    act(() => result.current.goToQuestion(2))
    act(() => result.current.goNext())

    expect(result.current.showReview).toBe(true)
  })

  it('deve voltar da revisão com goBackToQuestions', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goToQuestion(2))
    act(() => result.current.goNext())
    expect(result.current.showReview).toBe(true)

    act(() => result.current.goBackToQuestions())
    expect(result.current.showReview).toBe(false)
  })

  it('deve invalidar cache e navegar para /listas ao chamar goBack', async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    })
    const invalidateSpy = vi.spyOn(queryClient, 'invalidateQueries')
    const wrapper = ({ children }: { children: React.ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children)

    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper,
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goBack())
    expect(invalidateSpy).toHaveBeenCalledWith({
      queryKey: ['exercise-lists'],
    })
    expect(mockPush).toHaveBeenCalledWith('/listas')
  })

  it('deve detectar lista finalizada', async () => {
    mockGetExerciseList.mockResolvedValue({
      ...mockData,
      exerciseList: {
        ...mockData.exerciseList,
        status: 'FINISHED' as const,
      },
    })

    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.isFinished).toBe(true)
  })

  it('deve mesclar answeredMap com respostas locais', async () => {
    mockGetExerciseList.mockResolvedValue({
      ...mockData,
      answeredMap: { q1: 0 },
    })

    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(result.current.mergedAnswers).toHaveProperty('q1', 0)
    expect(result.current.answeredCount).toBe(1)

    act(() => result.current.handleSelectAnswer('q2', 3))

    expect(result.current.mergedAnswers).toHaveProperty('q1', 0)
    expect(result.current.mergedAnswers).toHaveProperty('q2', 3)
    expect(result.current.answeredCount).toBe(2)
  })

  it('não deve passar do índice 0 com goPrev', async () => {
    const { result } = renderHook(() => useExerciseResolve('list-1'), {
      wrapper: createWrapper(),
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.goPrev())
    expect(result.current.currentIndex).toBe(0)
  })
})
