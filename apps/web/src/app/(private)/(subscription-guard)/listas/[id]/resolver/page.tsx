import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ExerciseResolveContent } from '@/components/exercise-list/exercise-resolve-content'
import { ExerciseResolveSkeleton } from '@/components/exercise-list/exercise-resolve-skeleton'

export const metadata: Metadata = {
  title: 'Resolver Lista | NeuroTutor',
}

export default async function ExerciseResolvePage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<ExerciseResolveSkeleton />}>
      <ExerciseResolveContent exerciseListId={id} />
    </Suspense>
  )
}
