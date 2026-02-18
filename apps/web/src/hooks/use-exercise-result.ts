'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useExerciseListResultQuery } from '@/hooks/use-exercise-list-result-query'

export function useExerciseResult(exerciseListId: string) {
  const router = useRouter()
  const query = useExerciseListResultQuery(exerciseListId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [revealedQuestions, setRevealedQuestions] = useState<
    Record<string, boolean>
  >({})

  const exerciseList = query.data?.exerciseList ?? null
  const questions = query.data?.questions ?? []
  const answers = query.data?.answers ?? []

  const answersMap = useMemo(
    () => Object.fromEntries(answers.map((a) => [a.questionId, a])),
    [answers],
  )

  const currentQuestion = questions[currentIndex] ?? null
  const currentAnswer = currentQuestion
    ? answersMap[currentQuestion.id] ?? null
    : null

  const correctCount = exerciseList?.correctCount ?? 0
  const totalQuestions = exerciseList?.totalQuestions ?? 0
  const percentage =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const totalTimeSeconds = useMemo(
    () => answers.reduce((sum, a) => sum + (a.timeSpentSeconds ?? 0), 0),
    [answers],
  )
  const avgTimePerQuestion = useMemo(
    () =>
      answers.length > 0 ? Math.round(totalTimeSeconds / answers.length) : 0,
    [totalTimeSeconds, answers.length],
  )

  const revealAnswer = useCallback((questionId: string) => {
    setRevealedQuestions((prev) => ({ ...prev, [questionId]: true }))
  }, [])

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(prev + 1, totalQuestions - 1))
  }, [totalQuestions])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const goBack = useCallback(() => {
    router.push('/listas')
  }, [router])

  const isQuestionRevealed = useCallback(
    (questionId: string) => !!revealedQuestions[questionId],
    [revealedQuestions],
  )

  return {
    ...query,
    exerciseList,
    questions,
    answers,
    answersMap,
    currentIndex,
    currentQuestion,
    currentAnswer,
    correctCount,
    totalQuestions,
    percentage,
    totalTimeSeconds,
    avgTimePerQuestion,
    revealedQuestions,
    revealAnswer,
    isQuestionRevealed,
    goToQuestion,
    goNext,
    goPrev,
    goBack,
  }
}
