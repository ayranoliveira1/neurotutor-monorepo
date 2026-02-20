'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Eye } from 'lucide-react'
import Link from 'next/link'
import type { AdminQuestion } from '@/actions/admin/list-questions'

interface QuestionsTableProps {
  questions: AdminQuestion[]
}

const difficultyConfig: Record<
  string,
  { label: string; variant: 'default' | 'secondary' | 'destructive' }
> = {
  EASY: { label: 'Fácil', variant: 'default' },
  MEDIUM: { label: 'Médio', variant: 'secondary' },
  HARD: { label: 'Difícil', variant: 'destructive' },
}

function truncate(text: string, maxLength: number) {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

export function QuestionsTable({ questions }: QuestionsTableProps) {
  if (questions.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border text-muted-foreground">
        Nenhuma questão encontrada.
      </div>
    )
  }

  return (
    <>
      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-36">ID Externo</TableHead>
              <TableHead>Enunciado</TableHead>
              <TableHead>Disciplina</TableHead>
              <TableHead>Origem</TableHead>
              <TableHead className="w-16">Ano</TableHead>
              <TableHead className="w-24">Dificuldade</TableHead>
              <TableHead className="w-28">Criado em</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {questions.map((question) => {
              const diff = question.difficulty
                ? difficultyConfig[question.difficulty]
                : null

              return (
                <TableRow key={question.id}>
                  <TableCell className="h-14 font-mono text-xs">
                    {question.externalId}
                  </TableCell>
                  <TableCell className="h-14 max-w-xs truncate">
                    {truncate(question.statement, 80)}
                  </TableCell>
                  <TableCell className="h-14">{question.subject}</TableCell>
                  <TableCell className="h-14 truncate">
                    {question.origin}
                  </TableCell>
                  <TableCell className="h-14">{question.year ?? '—'}</TableCell>
                  <TableCell className="h-14">
                    {diff ? (
                      <Badge variant={diff.variant}>{diff.label}</Badge>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="h-14">
                    {new Date(question.createdAt).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell className="h-14">
                    <Link
                      href={`/admin/questoes/${question.id}`}
                      className="inline-flex items-center justify-center rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-3 md:hidden">
        {questions.map((question) => {
          const diff = question.difficulty
            ? difficultyConfig[question.difficulty]
            : null

          return (
            <Link
              key={question.id}
              href={`/admin/questoes/${question.id}`}
              className="block rounded-lg border bg-card p-4 shadow-sm transition-colors hover:bg-muted/50"
            >
              <div className="min-w-0">
                <p className="font-mono text-xs text-muted-foreground">
                  {question.externalId}
                </p>
                <p className="mt-1 text-sm font-medium">
                  {truncate(question.statement, 120)}
                </p>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline">{question.subject}</Badge>
                <Badge variant="outline">{question.origin}</Badge>
                {question.year && (
                  <Badge variant="outline">{question.year}</Badge>
                )}
                {diff && <Badge variant={diff.variant}>{diff.label}</Badge>}
              </div>

              <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Criado em{' '}
                  {new Date(question.createdAt).toLocaleDateString('pt-BR')}
                </span>
              </div>
            </Link>
          )
        })}
      </div>
    </>
  )
}
