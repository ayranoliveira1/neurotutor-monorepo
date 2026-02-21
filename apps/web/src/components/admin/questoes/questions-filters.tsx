'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { fetchSubjectsAction } from '@/actions/exercise-list/fetch-subjects'
import { fetchYearsAction } from '@/actions/exercise-list/fetch-years'
import { fetchDifficultiesAction } from '@/actions/exercise-list/fetch-difficulties'

const difficultyLabels: Record<string, string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
}

export function QuestionsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const subjectsQuery = useQuery({
    queryKey: ['questions', 'subjects'],
    queryFn: () => fetchSubjectsAction(),
    staleTime: 5 * 60 * 1000,
  })

  const yearsQuery = useQuery({
    queryKey: ['questions', 'years'],
    queryFn: () => fetchYearsAction(),
    staleTime: 5 * 60 * 1000,
  })

  const difficultiesQuery = useQuery({
    queryKey: ['questions', 'difficulties'],
    queryFn: () => fetchDifficultiesAction(),
    staleTime: 5 * 60 * 1000,
  })

  const updateParams = useCallback(
    (updates: Record<string, string>) => {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('page')

      for (const [key, value] of Object.entries(updates)) {
        if (value) {
          params.set(key, value)
        } else {
          params.delete(key)
        }
      }

      const url = params.toString()
        ? `${pathname}?${params.toString()}`
        : pathname
      router.replace(url, { scroll: false })
    },
    [searchParams, pathname, router],
  )

  const hasFilters =
    !!searchParams.get('subject') ||
    !!searchParams.get('year') ||
    !!searchParams.get('difficulty')

  function clearFilters() {
    router.replace(pathname, { scroll: false })
  }

  const subjectOptions = [
    { value: '', label: 'Todas' },
    ...(subjectsQuery.data?.map((s) => ({ value: s, label: s })) ?? []),
  ]

  const yearOptions = [
    { value: '', label: 'Todos' },
    ...(yearsQuery.data?.map((y) => ({
      value: String(y),
      label: String(y),
    })) ?? []),
  ]

  const difficultyOptions = [
    { value: '', label: 'Todas' },
    ...(difficultiesQuery.data?.map((d) => ({
      value: d,
      label: difficultyLabels[d] ?? d,
    })) ?? []),
  ]

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1 min-w-0 flex-1 sm:w-44 sm:flex-none">
        <Label className="text-xs text-muted-foreground">Disciplina</Label>
        <Select
          options={subjectOptions}
          value={searchParams.get('subject') ?? ''}
          onChange={(e) => updateParams({ subject: e.target.value })}
        />
      </div>

      <div className="grid gap-1 min-w-0 flex-1 sm:w-32 sm:flex-none">
        <Label className="text-xs text-muted-foreground">Ano</Label>
        <Select
          options={yearOptions}
          value={searchParams.get('year') ?? ''}
          onChange={(e) => updateParams({ year: e.target.value })}
        />
      </div>

      <div className="grid gap-1 min-w-0 flex-1 sm:w-36 sm:flex-none">
        <Label className="text-xs text-muted-foreground">Dificuldade</Label>
        <Select
          options={difficultyOptions}
          value={searchParams.get('difficulty') ?? ''}
          onChange={(e) => updateParams({ difficulty: e.target.value })}
        />
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilters}
          className="w-full sm:w-auto self-end text-muted-foreground"
        >
          <X className="mr-1 h-4 w-4" />
          Limpar filtros
        </Button>
      )}
    </div>
  )
}
