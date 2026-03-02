'use client'

import { Skeleton } from '@/components/ui/skeleton'

export function StudyPlanProgressSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      <div className="rounded-lg border bg-card p-4 shadow-sm">
        <Skeleton className="h-5 w-28 mb-4" />
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center gap-1 rounded-md bg-muted/50 p-3"
            >
              <Skeleton className="h-5 w-5 rounded" />
              <Skeleton className="h-8 w-12" />
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border bg-card p-4 shadow-sm">
            <Skeleton className="h-5 w-24 mb-3" />
            <Skeleton className="h-2 w-full rounded-full mb-2" />
            <Skeleton className="h-3 w-20 mb-3" />
            <div className="grid grid-cols-2 gap-3 pt-2 border-t">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
