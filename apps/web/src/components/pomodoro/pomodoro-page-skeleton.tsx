import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

export function PomodoroPageSkeleton() {
  return (
    <div className="space-y-8">
      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timer skeleton */}
      <div className="flex flex-col items-center gap-6">
        <Skeleton className="size-[220px] rounded-full" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </div>
  )
}
