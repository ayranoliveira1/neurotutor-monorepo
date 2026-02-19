'use client'

import { useState, useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { format } from 'date-fns'
import { Search, X } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-range-picker'

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'PENDING', label: 'Pendente' },
  { value: 'IN_PROGRESS', label: 'Em andamento' },
  { value: 'FINISHED', label: 'Finalizada' },
]

function parseDateParam(value: string | null): Date | undefined {
  if (!value) return undefined
  const [year, month, day] = value.split('-').map(Number)
  if (!year || !month || !day) return undefined
  return new Date(year, month - 1, day)
}

export function ExerciseListsFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get('search') ?? '')

  const dateRange: DateRange | undefined = (() => {
    const from = parseDateParam(searchParams.get('startDate'))
    const to = parseDateParam(searchParams.get('endDate'))
    if (from || to) return { from, to }
    return undefined
  })()

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
      router.push(url)
    },
    [searchParams, pathname, router],
  )

  const hasFilters =
    !!searchParams.get('search') ||
    !!searchParams.get('status') ||
    !!searchParams.get('startDate') ||
    !!searchParams.get('endDate')

  function clearFilters() {
    setSearch('')
    router.push(pathname)
  }

  function handleDateRangeChange(range: DateRange | undefined) {
    updateParams({
      startDate: range?.from ? format(range.from, 'yyyy-MM-dd') : '',
      endDate: range?.to ? format(range.to, 'yyyy-MM-dd') : '',
    })
  }

  const debouncedUpdateSearch = useDebouncedCallback((value: string) => {
    updateParams({ search: value })
  }, 400)

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar por nome..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            debouncedUpdateSearch(e.target.value)
          }}
          className="pl-9"
        />
      </div>

      <div className="grid gap-1 min-w-0 flex-1 sm:w-40 sm:flex-none">
        <Label htmlFor="status-filter" className="text-xs text-muted-foreground">Status</Label>
        <Select
          id="status-filter"
          options={statusOptions}
          value={searchParams.get('status') ?? ''}
          onChange={(e) => updateParams({ status: e.target.value })}
        />
      </div>

      <div className="grid gap-1 w-full sm:w-auto">
        <Label className="text-xs text-muted-foreground">
          Período de criação
        </Label>
        <DateRangePicker
          value={dateRange}
          onChange={handleDateRangeChange}
          placeholder="Selecione o período"
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
