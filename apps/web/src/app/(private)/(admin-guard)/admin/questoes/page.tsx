import { Suspense } from 'react'
import type { Metadata } from 'next'
import { QuestionsPageContent } from '@/components/admin/questoes/questions-page-content'
import { QuestionsPageSkeleton } from '@/components/admin/questoes/questions-page-skeleton'

export const metadata: Metadata = {
  title: 'Questões | Admin | NeuroTutor',
}

export default function AdminQuestionsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<QuestionsPageSkeleton />}>
        <QuestionsPageContent />
      </Suspense>
    </div>
  )
}
