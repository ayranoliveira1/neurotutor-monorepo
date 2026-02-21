'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Plus,
  AlertCircle,
  BookOpen,
  GraduationCap,
  BarChart3,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useQuestionsStatsQuery } from '@/hooks/admin/use-questions-stats-query'
import { useQuestionsListQuery } from '@/hooks/admin/use-questions-list-query'
import { QuestionsPageSkeleton } from './questions-page-skeleton'
import { QuestionsFilters } from './questions-filters'
import { QuestionsTable } from './questions-table'
import { QuestionsPagination } from './questions-pagination'

export function QuestionsPageContent() {
  const searchParams = useSearchParams()
  const statsQuery = useQuestionsStatsQuery()

  const page = Number(searchParams.get('page')) || 1
  const subject = searchParams.get('subject') ?? ''
  const year = searchParams.get('year') ?? ''
  const difficulty = searchParams.get('difficulty') ?? ''

  const listQuery = useQuestionsListQuery({
    page,
    perPage: 10,
    subject: subject || undefined,
    year: year || undefined,
    difficulty: difficulty || undefined,
  })

  if (statsQuery.isLoading) {
    return <QuestionsPageSkeleton />
  }

  if (statsQuery.isError) {
    const message =
      statsQuery.error instanceof Error
        ? statsQuery.error.message
        : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  const { total, bySubject } = statsQuery.data!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Questões</h2>
          <p className="text-muted-foreground">
            Gerencie as questões da plataforma.
          </p>
        </div>
        <Button asChild size="icon" className="sm:size-auto sm:px-4 sm:py-2">
          <Link href="/admin/questoes/criar">
            <Plus className="h-4 w-4 sm:mr-2" />
            <span className="hidden sm:inline">Criar questão</span>
          </Link>
        </Button>
      </div>

      {/* Cards de estatísticas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total de Questões
            </CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {total.toLocaleString('pt-BR')}
            </div>
            <p className="text-xs text-muted-foreground">
              cadastradas na plataforma
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Disciplinas</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bySubject.length}</div>
            <p className="text-xs text-muted-foreground">
              disciplinas cadastradas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Média por Disciplina
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bySubject.length > 0
                ? Math.round(total / bySubject.length).toLocaleString('pt-BR')
                : 0}
            </div>
            <p className="text-xs text-muted-foreground">questões em média</p>
          </CardContent>
        </Card>
      </div>

      {/* Breakdown completo por disciplina */}
      <Card>
        <CardHeader>
          <CardTitle>Questões por Disciplina</CardTitle>
          <CardDescription>
            Distribuição de questões entre todas as disciplinas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {bySubject.map((item) => (
              <div
                key={item.subject}
                className="flex items-center justify-between"
              >
                <span className="text-sm font-medium">{item.subject}</span>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted sm:w-48">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{
                        width: `${(item.count / total) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="w-12 text-right text-sm text-muted-foreground">
                    {item.count.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Tabela de questões */}
      <QuestionsFilters />

      {listQuery.isLoading ? (
        <div className="flex h-32 items-center justify-center rounded-md border text-muted-foreground">
          Carregando questões...
        </div>
      ) : listQuery.isError ? (
        <div className="flex h-32 items-center justify-center rounded-md border border-destructive/50 bg-destructive/5 text-sm text-destructive">
          Erro ao carregar questões.
        </div>
      ) : (
        <>
          <QuestionsTable questions={listQuery.data!.questions} />

          {listQuery.data!.totalPages > 1 && (
            <QuestionsPagination
              currentPage={listQuery.data!.currentPage}
              totalPages={listQuery.data!.totalPages}
              totalItems={listQuery.data!.totalItems}
            />
          )}
        </>
      )}
    </div>
  )
}
