'use client'

import { useCallback } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Select } from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const statusOptions = [
  { value: '', label: 'Todos' },
  { value: 'ACTIVE', label: 'Ativo' },
  { value: 'COMPLETED', label: 'Concluído' },
  { value: 'ARCHIVED', label: 'Arquivado' },
]

export function StudyPlansFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

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

  const hasFilters = !!searchParams.get('status')

  function clearFilters() {
    router.push(pathname)
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
      <div className="grid gap-1 min-w-0 flex-1 sm:w-40 sm:flex-none">
        <Label htmlFor="status-filter" className="text-xs text-muted-foreground">
          Status
        </Label>
        <Select
          id="status-filter"
          options={statusOptions}
          value={searchParams.get('status') ?? ''}
          onChange={(e) => updateParams({ status: e.target.value })}
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
