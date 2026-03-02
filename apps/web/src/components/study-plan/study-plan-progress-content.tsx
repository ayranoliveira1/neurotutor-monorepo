'use client'

import { useParams } from 'next/navigation'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, Calendar } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useStudyPlanProgressQuery } from '@/hooks/use-study-plan-progress-query'
import { StudyPlanProgressSkeleton } from './study-plan-progress-skeleton'
import { GoalProgressCard } from './goal-progress-card'
import { OverallProgressCard } from './overall-progress-card'

const statusConfig = {
  ACTIVE: { label: 'Ativo', variant: 'default' as const },
  COMPLETED: { label: 'Concluído', variant: 'secondary' as const },
  ARCHIVED: { label: 'Arquivado', variant: 'outline' as const },
}

export function StudyPlanProgressContent() {
  const params = useParams()
  const id = params.id as string
  const { data, isLoading, isError, error } = useStudyPlanProgressQuery(id)

  if (isLoading) {
    return <StudyPlanProgressSkeleton />
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
        <Button variant="outline" asChild>
          <Link href="/planos-estudo">Voltar para planos</Link>
        </Button>
      </div>
    )
  }

  if (!data) return null

  const { studyPlan, goalsProgress, overall } = data
  const status = statusConfig[studyPlan.status]

  return (
    <div className="space-y-6">
      <div>
        <Button variant="ghost" size="sm" asChild className="mb-2">
          <Link href="/planos-estudo">
            <ArrowLeft className="mr-1 h-4 w-4" />
            Voltar
          </Link>
        </Button>

        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {studyPlan.name}
            </h2>
            {studyPlan.description && (
              <p className="text-muted-foreground mt-1">
                {studyPlan.description}
              </p>
            )}
            <div className="flex items-center gap-2 mt-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>
                {new Date(studyPlan.startDate).toLocaleDateString('pt-BR')}
                {' - '}
                {new Date(studyPlan.endDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
      </div>

      <OverallProgressCard overall={overall} />

      {goalsProgress.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Metas por disciplina</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {goalsProgress.map((goal) => (
              <GoalProgressCard key={goal.goalId} goal={goal} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
