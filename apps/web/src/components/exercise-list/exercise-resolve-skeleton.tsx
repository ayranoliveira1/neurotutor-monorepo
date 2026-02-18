'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function ExerciseResolveSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-48 sm:w-64" />
        <Skeleton className="mt-2 h-4 w-32 sm:w-40" />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {Array.from({ length: 10 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-10 shrink-0 rounded-md" />
        ))}
      </div>

      <div className="rounded-lg border bg-card p-4 sm:p-6 space-y-4">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-20 w-full" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      </div>
    </div>
  )
}
