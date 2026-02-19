'use client'

import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  MoreHorizontal,
  Play,
  BarChart3,
  Trash2,
  Calendar,
  BookOpen,
  Clock,
} from 'lucide-react'
import { formatTime } from '@/lib/format-time'
import type { ExerciseListItem } from '@/actions/exercise-list/types'
import { SubjectBadges } from './subject-badges'
import { ExerciseListsEmptyState } from './exercise-lists-empty-state'

interface ExerciseListsTableProps {
  exerciseLists: ExerciseListItem[]
  onDelete: (item: ExerciseListItem) => void
  onCreateNew: () => void
  hasActiveFilters: boolean
}

const statusConfig = {
  PENDING: { label: 'Pendente', variant: 'secondary' as const },
  IN_PROGRESS: { label: 'Em andamento', variant: 'default' as const },
  FINISHED: { label: 'Finalizada', variant: 'outline' as const },
}

function getListHref(item: ExerciseListItem) {
  if (item.status === 'FINISHED') {
    return `/listas/${item.id}/resultado`
  }
  return `/listas/${item.id}/resolver`
}

function getPercentageBadgeClass(percentage: number) {
  if (percentage < 20)
    return 'bg-red-100 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-400 dark:border-red-800'
  if (percentage < 50)
    return 'bg-yellow-100 text-yellow-700 border-yellow-200 dark:bg-yellow-950 dark:text-yellow-400 dark:border-yellow-800'
  if (percentage < 80)
    return 'bg-green-100 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-400 dark:border-green-800'
  return 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-400 dark:border-blue-800'
}

export function ExerciseListsTable({
  exerciseLists,
  onDelete,
  onCreateNew,
  hasActiveFilters,
}: ExerciseListsTableProps) {
  if (exerciseLists.length === 0) {
    return (
      <ExerciseListsEmptyState
        hasActiveFilters={hasActiveFilters}
        onCreateNew={onCreateNew}
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {exerciseLists.map((item) => {
        const status = statusConfig[item.status]
        const percentage =
          item.correctCount !== null && item.totalQuestions > 0
            ? Math.round((item.correctCount / item.totalQuestions) * 100)
            : null
        const badgeClass =
          percentage !== null ? getPercentageBadgeClass(percentage) : ''

        const isFinished = item.status === 'FINISHED'
        const hasTimeData =
          isFinished &&
          item.totalTimeSeconds != null &&
          item.totalTimeSeconds > 0

        return (
          <Link
            key={item.id}
            href={getListHref(item)}
            className="flex flex-col rounded-lg border bg-card shadow-sm transition-colors hover:bg-accent/50"
          >
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 truncate font-medium">
                  {item.name}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <SubjectBadges sections={item.sections} />
                  <div onClick={(e) => e.preventDefault()}>
                    <ActionsDropdown item={item} onDelete={onDelete} />
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge variant={status.variant}>{status.label}</Badge>
                {percentage !== null && (
                  <Badge variant="outline" className={badgeClass}>
                    {percentage}% ({item.correctCount}/{item.totalQuestions})
                  </Badge>
                )}
              </div>
            </div>

            <div className="mx-4 grid grid-cols-1 gap-2 rounded-md bg-muted/50 p-2.5 text-xs sm:grid-cols-2">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5" />
                Tempo total{' '}
                {hasTimeData ? (
                  <span className="font-semibold text-foreground">
                    {formatTime(item.totalTimeSeconds!)}
                  </span>
                ) : (
                  <span className="italic">Não finalizada</span>
                )}
              </span>
              <span className="text-muted-foreground">
                Média por questão{' '}
                {hasTimeData &&
                item.avgTimePerQuestion != null &&
                item.avgTimePerQuestion > 0 ? (
                  <span className="font-semibold text-foreground">
                    {formatTime(item.avgTimePerQuestion)}
                  </span>
                ) : (
                  <span className="italic">Não finalizada</span>
                )}
              </span>
            </div>

            <div className="mt-auto flex items-center gap-3 border-t px-4 py-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <BookOpen className="h-3.5 w-3.5" />
                {item.totalQuestions} questões
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(item.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function ActionsDropdown({
  item,
  onDelete,
}: {
  item: ExerciseListItem
  onDelete: (item: ExerciseListItem) => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {item.status !== 'FINISHED' && (
          <DropdownMenuItem asChild>
            <Link href={`/listas/${item.id}/resolver`}>
              <Play className="mr-2 h-4 w-4" />
              {item.status === 'IN_PROGRESS'
                ? 'Continuar resolvendo'
                : 'Resolver'}
            </Link>
          </DropdownMenuItem>
        )}
        {item.status === 'FINISHED' && (
          <DropdownMenuItem asChild>
            <Link href={`/listas/${item.id}/resultado`}>
              <BarChart3 className="mr-2 h-4 w-4" />
              Ver resultado
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onClick={() => onDelete(item)}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Excluir
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
