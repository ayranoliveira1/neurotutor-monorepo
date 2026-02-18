'use client'

import { Button } from '@/components/ui/button'
import {
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Trophy,
  CheckCircle2,
  XCircle,
  Eye,
  Clock,
} from 'lucide-react'
import { useExerciseResult } from '@/hooks/use-exercise-result'
import { formatTime } from '@/lib/format-time'
import { ExerciseResolveSkeleton } from './exercise-resolve-skeleton'
import { SubjectBadges } from './subject-badges'
import { QuestionCard } from './question-card'

interface ExerciseResultContentProps {
  exerciseListId: string
}

export function ExerciseResultContent({
  exerciseListId,
}: ExerciseResultContentProps) {
  const {
    isLoading,
    isError,
    error,
    exerciseList,
    questions,
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
    goToQuestion,
    goNext,
    goPrev,
    goBack,
  } = useExerciseResult(exerciseListId)

  if (isLoading) return <ExerciseResolveSkeleton />

  if (isError) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido'
    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
        <Button variant="outline" onClick={goBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="ghost" size="icon-sm" onClick={goBack}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          {exerciseList!.name}
        </h2>
        <SubjectBadges sections={exerciseList!.sections} max={Infinity} />
      </div>

      <div className="rounded-lg border bg-card p-4 sm:p-6">
        <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
              <Trophy className="h-7 w-7 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {correctCount}/{totalQuestions}
              </p>
              <p className="text-sm text-muted-foreground">
                {percentage}% de acerto
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-1.5 text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>{correctCount} corretas</span>
            </div>
            <div className="flex items-center gap-1.5 text-red-600">
              <XCircle className="h-4 w-4" />
              <span>{totalQuestions - correctCount} erradas</span>
            </div>
            {totalTimeSeconds > 0 && (
              <>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Total: {formatTime(totalTimeSeconds)}</span>
                </div>
                <div className="flex items-center gap-1.5 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Média: {formatTime(avgTimePerQuestion)}/questão</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const answer = answersMap[q.id]
          const isCorrect = answer?.isCorrect === true
          const isCurrent = i === currentIndex
          return (
            <button
              key={q.id}
              onClick={() => goToQuestion(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isCorrect
                    ? 'border-green-500/30 bg-green-50 text-green-700 dark:bg-green-950/20 dark:text-green-400'
                    : 'border-red-500/30 bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-400'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {currentQuestion && (
        <>
          <QuestionCard
            question={currentQuestion}
            questionNumber={currentIndex + 1}
            selectedAnswer={currentAnswer?.selectedAnswer ?? null}
            onSelectAnswer={() => {}}
            correctAnswer={
              currentAnswer?.isCorrect ||
              revealedQuestions[currentQuestion.id]
                ? currentQuestion.correctAnswer
                : null
            }
            showResult
            disabled
          />

          {currentAnswer && currentAnswer.timeSpentSeconds > 0 && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              <span>
                Tempo nesta questão: {formatTime(currentAnswer.timeSpentSeconds)}
              </span>
            </div>
          )}

          {currentAnswer?.isCorrect === false &&
            !revealedQuestions[currentQuestion.id] && (
              <Button
                variant="outline"
                onClick={() => revealAnswer(currentQuestion.id)}
                className="w-full"
              >
                <Eye className="mr-2 h-4 w-4" />
                Ver resposta correta
              </Button>
            )}
        </>
      )}

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          disabled={currentIndex === 0}
          onClick={goPrev}
        >
          <ChevronLeft className="mr-1 h-4 w-4" />
          Anterior
        </Button>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {totalQuestions}
        </span>
        <Button
          variant="outline"
          disabled={currentIndex === totalQuestions - 1}
          onClick={goNext}
        >
          Próxima
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
