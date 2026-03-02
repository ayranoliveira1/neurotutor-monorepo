import { Suspense } from 'react'
import type { Metadata } from 'next'
import { StudyPlansPageContent } from '@/components/study-plan/study-plans-page-content'
import { StudyPlansPageSkeleton } from '@/components/study-plan/study-plans-page-skeleton'

export const metadata: Metadata = {
  title: 'Planos de Estudo | NeuroTutor',
}

export default function StudyPlansPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<StudyPlansPageSkeleton />}>
        <StudyPlansPageContent />
      </Suspense>
    </div>
  )
}
