import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ExerciseResultContent } from '@/components/exercise-list/exercise-result-content'
import { ExerciseResolveSkeleton } from '@/components/exercise-list/exercise-resolve-skeleton'

export const metadata: Metadata = {
  title: 'Resultado | NeuroTutor',
}

export default async function ExerciseResultPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  return (
    <Suspense fallback={<ExerciseResolveSkeleton />}>
      <ExerciseResultContent exerciseListId={id} />
    </Suspense>
  )
}
