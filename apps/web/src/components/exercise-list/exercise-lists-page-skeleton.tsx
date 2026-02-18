'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ExerciseListsPageSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Skeleton className="h-8 w-52" />
          <Skeleton className="mt-2 h-4 w-72" />
        </div>
        <Skeleton className="h-10 w-10 sm:w-36" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <Skeleton className="h-5 w-40" />
                <Skeleton className="mt-2 h-4 w-28" />
              </div>
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="mt-3 h-3 w-36" />
          </div>
        ))}
      </div>
    </div>
  )
}
