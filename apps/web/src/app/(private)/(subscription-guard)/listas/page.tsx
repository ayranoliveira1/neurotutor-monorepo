import { Suspense } from 'react'
import type { Metadata } from 'next'
import { ExerciseListsPageContent } from '@/components/exercise-list/exercise-lists-page-content'
import { ExerciseListsPageSkeleton } from '@/components/exercise-list/exercise-lists-page-skeleton'

export const metadata: Metadata = {
  title: 'Listas de Exercícios | NeuroTutor',
}

export default function ExerciseListsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<ExerciseListsPageSkeleton />}>
        <ExerciseListsPageContent />
      </Suspense>
    </div>
  )
}
