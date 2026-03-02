import { Suspense } from 'react'
import type { Metadata } from 'next'
import { StudyPlanProgressContent } from '@/components/study-plan/study-plan-progress-content'
import { StudyPlanProgressSkeleton } from '@/components/study-plan/study-plan-progress-skeleton'

export const metadata: Metadata = {
  title: 'Progresso do Plano | NeuroTutor',
}

export default function StudyPlanProgressPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<StudyPlanProgressSkeleton />}>
        <StudyPlanProgressContent />
      </Suspense>
    </div>
  )
}
