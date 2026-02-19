'use client'

import { Skeleton } from '@/components/ui/skeleton'

function CardSkeleton() {
  return (
    <div className="flex flex-col rounded-lg border bg-card shadow-sm">
      {/* Header: name + subject badges + actions */}
      <div className="flex flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <Skeleton className="h-5 w-36" />
          <div className="flex shrink-0 items-center gap-1">
            <Skeleton className="h-5 w-16 rounded-full" />
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
        </div>

        {/* Status badge + percentage */}
        <div className="flex flex-wrap items-center gap-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-5 w-24 rounded-full" />
        </div>
      </div>

      {/* Time stats section */}
      <div className="mx-4 grid grid-cols-1 gap-2 rounded-md bg-muted/50 p-2.5 sm:grid-cols-2">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Footer: questions count + date */}
      <div className="mt-auto flex items-center gap-3 border-t px-4 py-2.5">
        <Skeleton className="h-3.5 w-20" />
        <Skeleton className="h-3.5 w-24" />
      </div>
    </div>
  )
}

export function ExerciseListsPageSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header: title + button */}
      <div className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-10 sm:w-36" />
      </div>

      {/* Filters: search + status select + date range */}
      <div className="flex flex-wrap items-end gap-3">
        <Skeleton className="h-9 w-full max-w-sm" />
        <div className="grid gap-1 min-w-0 flex-1 sm:w-40 sm:flex-none">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-9 w-full" />
        </div>
        <div className="grid gap-1 w-full sm:w-auto">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-9 w-full sm:w-56" />
        </div>
      </div>

      {/* Cards grid: 9 cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center gap-2 sm:flex-row sm:justify-between">
        <Skeleton className="h-4 w-32" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  )
}
