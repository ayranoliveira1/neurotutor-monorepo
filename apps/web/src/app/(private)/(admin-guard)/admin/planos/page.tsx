import { Suspense } from 'react'
import type { Metadata } from 'next'
import { PlansPageContent } from '@/components/admin/plans-page-content'
import { PlansPageSkeleton } from '@/components/admin/plans-page-skeleton'

export const metadata: Metadata = {
  title: 'Planos | Admin | NeuroTutor',
}

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<PlansPageSkeleton />}>
        <PlansPageContent />
      </Suspense>
    </div>
  )
}
