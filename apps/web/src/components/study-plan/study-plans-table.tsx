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
  BarChart3,
  Pencil,
  Trash2,
  Archive,
  CheckCircle2,
  Calendar,
  Target,
} from 'lucide-react'
import type { StudyPlanItem } from '@/actions/study-plan/types'
import { StudyPlansEmptyState } from './study-plans-empty-state'

interface StudyPlansTableProps {
  studyPlans: StudyPlanItem[]
  onDelete: (item: StudyPlanItem) => void
  onEdit: (item: StudyPlanItem) => void
  onChangeStatus: (plan: StudyPlanItem, targetStatus: 'COMPLETED' | 'ARCHIVED') => void
  onCreateNew: () => void
  hasActiveFilters: boolean
}

const statusConfig = {
  ACTIVE: { label: 'Ativo', variant: 'default' as const },
  COMPLETED: { label: 'Concluído', variant: 'secondary' as const },
  ARCHIVED: { label: 'Arquivado', variant: 'outline' as const },
}

export function StudyPlansTable({
  studyPlans,
  onDelete,
  onEdit,
  onChangeStatus,
  onCreateNew,
  hasActiveFilters,
}: StudyPlansTableProps) {
  if (studyPlans.length === 0) {
    return (
      <StudyPlansEmptyState
        hasActiveFilters={hasActiveFilters}
        onCreateNew={onCreateNew}
      />
    )
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {studyPlans.map((item) => {
        const status = statusConfig[item.status]

        return (
          <Link
            key={item.id}
            href={`/planos-estudo/${item.id}`}
            className="flex flex-col rounded-lg border bg-card shadow-sm transition-colors hover:bg-accent/50"
          >
            <div className="flex flex-col gap-2 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="min-w-0 flex-1 truncate font-medium">
                  {item.name}
                </p>
                <div className="flex shrink-0 items-center gap-1">
                  <Badge variant={status.variant}>{status.label}</Badge>
                  <div onClick={(e) => e.preventDefault()}>
                    <ActionsDropdown
                      item={item}
                      onDelete={onDelete}
                      onEdit={onEdit}
                      onChangeStatus={onChangeStatus}
                    />
                  </div>
                </div>
              </div>

              {item.description && (
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
              )}
            </div>

            <div className="mx-4 grid grid-cols-2 gap-2 rounded-md bg-muted/50 p-2.5 text-xs">
              <span className="flex items-center gap-1 text-muted-foreground">
                <Target className="h-3.5 w-3.5" />
                <span className="font-semibold text-foreground">
                  {item.goals.length}
                </span>{' '}
                meta{item.goals.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1 text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(item.startDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
                {' - '}
                {new Date(item.endDate).toLocaleDateString('pt-BR', {
                  day: '2-digit',
                  month: 'short',
                })}
              </span>
            </div>

            <div className="mt-auto flex items-center gap-3 border-t px-4 py-2.5 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                Criado em{' '}
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
  onEdit,
  onChangeStatus,
}: {
  item: StudyPlanItem
  onDelete: (item: StudyPlanItem) => void
  onEdit: (item: StudyPlanItem) => void
  onChangeStatus: (plan: StudyPlanItem, targetStatus: 'COMPLETED' | 'ARCHIVED') => void
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon-sm">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={`/planos-estudo/${item.id}`}>
            <BarChart3 className="mr-2 h-4 w-4" />
            Ver progresso
          </Link>
        </DropdownMenuItem>
        {item.status === 'ACTIVE' && (
          <>
            <DropdownMenuItem onClick={() => onEdit(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Editar
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus(item, 'COMPLETED')}>
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Concluir
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onChangeStatus(item, 'ARCHIVED')}>
              <Archive className="mr-2 h-4 w-4" />
              Arquivar
            </DropdownMenuItem>
          </>
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
