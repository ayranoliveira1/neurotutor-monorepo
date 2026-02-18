'use client'

import { useRef, useEffect, useCallback } from 'react'

interface UseQuestionTimerProps {
  currentQuestionId: string | null
  answeredQuestionIds: Set<string>
  timeMap: Record<string, number>
}

export function useQuestionTimer({
  currentQuestionId,
  answeredQuestionIds,
  timeMap,
}: UseQuestionTimerProps) {
  const timesRef = useRef<Record<string, number>>({})
  const startedAtRef = useRef<number | null>(null)
  const activeQuestionRef = useRef<string | null>(null)
  const initializedRef = useRef(false)

  // Inicializa com tempos do servidor (apenas uma vez quando os dados chegam)
  useEffect(() => {
    if (!initializedRef.current && Object.keys(timeMap).length > 0) {
      timesRef.current = { ...timeMap }
      initializedRef.current = true
    }
  }, [timeMap])

  // Salva tempo acumulado da questão ativa
  const flushActiveTime = useCallback(() => {
    if (activeQuestionRef.current && startedAtRef.current) {
      const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000)
      const prev = timesRef.current[activeQuestionRef.current] ?? 0
      timesRef.current[activeQuestionRef.current] = prev + elapsed
      startedAtRef.current = null
    }
  }, [])

  // Ao mudar de questão
  useEffect(() => {
    // Salva tempo da questão anterior
    flushActiveTime()

    activeQuestionRef.current = currentQuestionId

    // Só inicia timer se a questão não foi respondida
    if (currentQuestionId && !answeredQuestionIds.has(currentQuestionId)) {
      startedAtRef.current = Date.now()
    } else {
      startedAtRef.current = null
    }
  }, [currentQuestionId, answeredQuestionIds, flushActiveTime])

  // Cleanup ao desmontar (sair da página)
  useEffect(() => {
    return () => {
      flushActiveTime()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const getTimeForQuestion = useCallback(
    (questionId: string) => {
      const base = timesRef.current[questionId] ?? 0
      // Se é a questão ativa e o timer está rodando, soma o tempo decorrido
      if (
        questionId === activeQuestionRef.current &&
        startedAtRef.current
      ) {
        const elapsed = Math.round((Date.now() - startedAtRef.current) / 1000)
        return base + elapsed
      }
      return base
    },
    [],
  )

  return { getTimeForQuestion, flushActiveTime }
}
