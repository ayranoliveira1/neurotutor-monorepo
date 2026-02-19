'use client'

import { useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { useExerciseListQuery } from '@/hooks/use-exercise-list-query'
import { useQuestionTimer } from '@/hooks/use-question-timer'
import { answerQuestionAction } from '@/actions/exercise-list/answer-question'
import { finishExerciseListAction } from '@/actions/exercise-list/finish-exercise-list'

export function useExerciseResolve(exerciseListId: string) {
  const router = useRouter()
  const queryClient = useQueryClient()
  const query = useExerciseListQuery(exerciseListId)

  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number>>({})
  const [showReview, setShowReview] = useState(false)

  const answerAction = useAction(answerQuestionAction, {
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao salvar resposta')
    },
  })

  const finishAction = useAction(finishExerciseListAction, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['exercise-lists'] })
      router.push(`/listas/${exerciseListId}/resultado`)
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao finalizar lista')
    },
  })

  const exerciseList = query.data?.exerciseList ?? null
  const questions = query.data?.questions ?? []
  const answeredMap = query.data?.answeredMap ?? {}
  const timeMap = query.data?.timeMap ?? {}

  const mergedAnswers = useMemo(
    () => ({ ...answeredMap, ...answers }),
    [answeredMap, answers],
  )

  const currentQuestion = questions[currentIndex] ?? null
  const totalQuestions = questions.length
  const answeredCount = Object.keys(mergedAnswers).length
  const isFinished = exerciseList?.status === 'FINISHED'

  const answeredQuestionIds = useMemo(
    () => new Set(Object.keys(mergedAnswers)),
    [mergedAnswers],
  )

  const { getTimeForQuestion, flushActiveTime } = useQuestionTimer({
    currentQuestionId: currentQuestion?.id ?? null,
    answeredQuestionIds,
    timeMap,
  })

  const handleSelectAnswer = useCallback(
    (questionId: string, answer: number) => {
      const timeSpentSeconds = getTimeForQuestion(questionId)
      setAnswers((prev) => ({ ...prev, [questionId]: answer }))
      answerAction.execute({
        exerciseListId,
        questionId,
        selectedAnswer: answer,
        timeSpentSeconds,
      })
    },
    [exerciseListId, answerAction, getTimeForQuestion],
  )

  const handleFinish = useCallback(() => {
    finishAction.execute({ id: exerciseListId })
  }, [exerciseListId, finishAction])

  const goToQuestion = useCallback((index: number) => {
    setCurrentIndex(index)
  }, [])

  const goNext = useCallback(() => {
    if (currentIndex === totalQuestions - 1) {
      setShowReview(true)
    } else {
      setCurrentIndex((prev) => prev + 1)
    }
  }, [currentIndex, totalQuestions])

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(prev - 1, 0))
  }, [])

  const goBackToQuestions = useCallback(() => {
    setShowReview(false)
  }, [])

  const goBack = useCallback(() => {
    flushActiveTime()
    queryClient.invalidateQueries({ queryKey: ['exercise-lists'] })
    router.push('/listas')
  }, [flushActiveTime, queryClient, router])

  return {
    ...query,
    exerciseList,
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions,
    mergedAnswers,
    answeredCount,
    submitting: answerAction.isPending,
    finishing: finishAction.isPending,
    isFinished,
    showReview,
    handleSelectAnswer,
    handleFinish,
    goToQuestion,
    goNext,
    goPrev,
    goBackToQuestions,
    goBack,
    getTimeForQuestion,
  }
}
