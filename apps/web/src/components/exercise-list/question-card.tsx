'use client'

import { Badge } from '@/components/ui/badge'
import type { QuestionData } from '@/actions/exercise-list/types'

interface QuestionCardProps {
  question: QuestionData
  questionNumber: number
  selectedAnswer: number | null
  onSelectAnswer: (answer: number) => void
  disabled?: boolean
  correctAnswer?: number | null
  showResult?: boolean
}

const letters = ['A', 'B', 'C', 'D', 'E']

const difficultyConfig: Record<string, { label: string; className: string }> = {
  EASY: {
    label: 'Fácil',
    className:
      'border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-950/20 dark:text-green-400',
  },
  MEDIUM: {
    label: 'Médio',
    className:
      'border-yellow-200 bg-yellow-50 text-yellow-700 dark:border-yellow-800 dark:bg-yellow-950/20 dark:text-yellow-400',
  },
  HARD: {
    label: 'Difícil',
    className:
      'border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-400',
  },
}

export function QuestionCard({
  question,
  questionNumber,
  selectedAnswer,
  onSelectAnswer,
  disabled,
  correctAnswer,
  showResult,
}: QuestionCardProps) {
  return (
    <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">Questão {questionNumber}</Badge>
        <Badge variant="secondary">{question.subject}</Badge>
        {question.origin && (
          <Badge variant="secondary">{question.origin}</Badge>
        )}
        {question.year && (
          <Badge variant="secondary">{question.year}</Badge>
        )}
        {question.difficulty && difficultyConfig[question.difficulty] && (
          <Badge
            variant="outline"
            className={difficultyConfig[question.difficulty].className}
          >
            {difficultyConfig[question.difficulty].label}
          </Badge>
        )}
      </div>

      <div
        className="prose prose-sm max-w-none dark:prose-invert overflow-hidden wrap-anywhere [&_img]:max-w-full"
        dangerouslySetInnerHTML={{ __html: question.statement }}
      />

      {question.imageUrl && (
        <img
          src={question.imageUrl}
          alt={`Imagem da questão ${questionNumber}`}
          className="max-h-48 w-full sm:max-h-80 rounded-md object-contain"
        />
      )}

      <div className="space-y-2">
        {(question.alternatives as string[]).map((alt, index) => {
          const isSelected = selectedAnswer === index
          const hasCorrectAnswer = showResult && correctAnswer != null
          const isCorrect = hasCorrectAnswer && correctAnswer === index
          const isWrong =
            hasCorrectAnswer && isSelected && correctAnswer !== index
          const isWrongNoReveal =
            showResult && !hasCorrectAnswer && isSelected

          let className =
            'flex w-full items-start gap-3 rounded-md border p-3 text-left text-sm transition-colors'

          if (isCorrect) {
            className += ' border-green-500 bg-green-50 dark:bg-green-950/20'
          } else if (isWrong || isWrongNoReveal) {
            className += ' border-red-500 bg-red-50 dark:bg-red-950/20'
          } else if (isSelected) {
            className += ' border-primary bg-primary/5'
          } else {
            className += ' border-border hover:bg-accent'
          }

          if (disabled && !showResult) {
            className += ' cursor-not-allowed opacity-60'
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelectAnswer(index)}
              disabled={disabled || showResult}
              className={className}
            >
              <span
                className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs font-bold ${
                  isSelected || isCorrect
                    ? isCorrect
                      ? 'border-green-500 bg-green-500 text-white'
                      : isWrong || isWrongNoReveal
                        ? 'border-red-500 bg-red-500 text-white'
                        : 'border-primary bg-primary text-primary-foreground'
                    : 'border-border'
                }`}
              >
                {letters[index]}
              </span>
              <span className="flex-1 wrap-break-word pt-0.5">{alt}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
