'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react'
import { QuestionCard } from './question-card'
import type { QuestionData } from '@/actions/exercise-list/types'

interface ExerciseReviewSectionProps {
  questions: QuestionData[]
  mergedAnswers: Record<string, number>
  answeredCount: number
  totalQuestions: number
  finishing: boolean
  onFinish: () => void
  onBackToQuestions: () => void
}

const letters = ['A', 'B', 'C', 'D', 'E']

export function ExerciseReviewSection({
  questions,
  mergedAnswers,
  answeredCount,
  totalQuestions,
  finishing,
  onFinish,
  onBackToQuestions,
}: ExerciseReviewSectionProps) {
  const [expandedId, setExpandedId] = useState<string | null>(
    questions[0]?.id ?? null,
  )

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
            Revisão
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {answeredCount} de {totalQuestions} respondidas
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => {
          const answered = question.id in mergedAnswers
          const selectedIndex = mergedAnswers[question.id] ?? null
          const isExpanded = expandedId === question.id

          return (
            <button
              key={question.id}
              onClick={() =>
                setExpandedId(isExpanded ? null : question.id)
              }
              data-testid="review-item"
              className={`flex h-10 min-w-10 items-center justify-center gap-1.5 rounded-md border px-2 text-sm font-medium transition-colors ${
                isExpanded
                  ? 'border-primary bg-primary text-primary-foreground'
                  : answered
                    ? 'border-primary/30 bg-primary/10 text-primary'
                    : 'border-border bg-background text-muted-foreground hover:bg-accent'
              }`}
            >
              <span>{index + 1}</span>
              {selectedIndex !== null && (
                <span className="text-xs opacity-70">
                  {letters[selectedIndex]}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {expandedId && (
        <QuestionCard
          question={questions.find((q) => q.id === expandedId)!}
          questionNumber={
            questions.findIndex((q) => q.id === expandedId) + 1
          }
          selectedAnswer={mergedAnswers[expandedId] ?? null}
          onSelectAnswer={() => {}}
          disabled
        />
      )}

      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBackToQuestions}>
          <ArrowLeft className="mr-1 h-4 w-4" />
          Voltar às questões
        </Button>
        <Button
          onClick={onFinish}
          disabled={finishing || answeredCount < totalQuestions}
        >
          {finishing ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle2 className="mr-2 h-4 w-4" />
          )}
          Finalizar
        </Button>
      </div>
    </div>
  )
}
