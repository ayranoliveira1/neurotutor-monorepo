import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQuestionTimer } from '../use-question-timer'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('useQuestionTimer', () => {
  it('deve retornar 0 para questão sem tempo acumulado', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: null,
        answeredQuestionIds: new Set(),
        timeMap: {},
      }),
    )

    expect(result.current.getTimeForQuestion('q1')).toBe(0)
  })

  it('deve inicializar com tempos do servidor', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: null,
        answeredQuestionIds: new Set(),
        timeMap: { q1: 30, q2: 45 },
      }),
    )

    expect(result.current.getTimeForQuestion('q1')).toBe(30)
    expect(result.current.getTimeForQuestion('q2')).toBe(45)
  })

  it('deve acumular tempo na questão ativa', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: 'q1',
        answeredQuestionIds: new Set(),
        timeMap: {},
      }),
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.getTimeForQuestion('q1')).toBe(5)
  })

  it('deve somar tempo do servidor com tempo decorrido', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: 'q1',
        answeredQuestionIds: new Set(),
        timeMap: { q1: 10 },
      }),
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.getTimeForQuestion('q1')).toBe(15)
  })

  it('não deve contar tempo para questões já respondidas', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: 'q1',
        answeredQuestionIds: new Set(['q1']),
        timeMap: { q1: 30 },
      }),
    )

    act(() => {
      vi.advanceTimersByTime(5000)
    })

    expect(result.current.getTimeForQuestion('q1')).toBe(30)
  })

  it('deve salvar tempo ao trocar de questão', () => {
    const { result, rerender } = renderHook(
      (props) => useQuestionTimer(props),
      {
        initialProps: {
          currentQuestionId: 'q1' as string | null,
          answeredQuestionIds: new Set<string>(),
          timeMap: {} as Record<string, number>,
        },
      },
    )

    act(() => {
      vi.advanceTimersByTime(10000)
    })

    rerender({
      currentQuestionId: 'q2',
      answeredQuestionIds: new Set<string>(),
      timeMap: {},
    })

    expect(result.current.getTimeForQuestion('q1')).toBe(10)
  })

  it('deve salvar tempo ao chamar flushActiveTime', () => {
    const { result } = renderHook(() =>
      useQuestionTimer({
        currentQuestionId: 'q1',
        answeredQuestionIds: new Set(),
        timeMap: {},
      }),
    )

    act(() => {
      vi.advanceTimersByTime(7000)
    })

    act(() => {
      result.current.flushActiveTime()
    })

    expect(result.current.getTimeForQuestion('q1')).toBe(7)
  })
})
