import { Suspense } from 'react'
import type { Metadata } from 'next'
import { RatingsPageContent } from '@/components/admin/avaliacoes/ratings-page-content'
import { RatingsPageSkeleton } from '@/components/admin/avaliacoes/ratings-page-skeleton'

export const metadata: Metadata = {
  title: 'Avaliações | Admin | NeuroTutor',
}

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<RatingsPageSkeleton />}>
        <RatingsPageContent />
      </Suspense>
    </div>
  )
}
