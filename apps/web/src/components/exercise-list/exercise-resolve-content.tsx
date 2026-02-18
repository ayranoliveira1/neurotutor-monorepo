'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle, ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react'
import { useExerciseResolve } from '@/hooks/use-exercise-resolve'
import { ExerciseResolveSkeleton } from './exercise-resolve-skeleton'
import { QuestionCard } from './question-card'
import { ExerciseReviewSection } from './exercise-review-section'
import { SubjectBadges } from './subject-badges'

interface ExerciseResolveContentProps {
  exerciseListId: string
}

export function ExerciseResolveContent({
  exerciseListId,
}: ExerciseResolveContentProps) {
  const {
    isLoading,
    isError,
    error,
    exerciseList,
    questions,
    currentIndex,
    currentQuestion,
    totalQuestions,
    mergedAnswers,
    answeredCount,
    submitting,
    finishing,
    isFinished,
    showReview,
    handleSelectAnswer,
    handleFinish,
    goToQuestion,
    goNext,
    goPrev,
    goBackToQuestions,
    goBack,
  } = useExerciseResolve(exerciseListId)

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

  if (isFinished) {
    goBack()
    return null
  }

  if (showReview) {
    return (
      <ExerciseReviewSection
        questions={questions}
        mergedAnswers={mergedAnswers}
        answeredCount={answeredCount}
        totalQuestions={totalQuestions}
        finishing={finishing}
        onFinish={handleFinish}
        onBackToQuestions={goBackToQuestions}
      />
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="ghost" size="icon-sm" onClick={goBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            {exerciseList!.name}
          </h2>
          <SubjectBadges sections={exerciseList!.sections} max={Infinity} />
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          {answeredCount} de {totalQuestions} respondidas
        </p>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {questions.map((q, i) => {
          const isAnswered = q.id in mergedAnswers
          const isCurrent = i === currentIndex
          return (
            <button
              key={q.id}
              onClick={() => goToQuestion(i)}
              className={`flex h-9 w-9 items-center justify-center rounded-md border text-sm font-medium transition-colors ${
                isCurrent
                  ? 'border-primary bg-primary text-primary-foreground'
                  : isAnswered
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              {i + 1}
            </button>
          )
        })}
      </div>

      {currentQuestion && (
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          selectedAnswer={mergedAnswers[currentQuestion.id] ?? null}
          onSelectAnswer={(answer) =>
            handleSelectAnswer(currentQuestion.id, answer)
          }
          disabled={submitting}
        />
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
        <Button variant="outline" onClick={goNext}>
          Próxima
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
