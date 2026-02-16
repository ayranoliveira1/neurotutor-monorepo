import type { Metadata } from 'next'
import { PlansPageContent } from '@/components/admin/plans-page-content'

export const metadata: Metadata = {
  title: 'Planos | Admin | NeuroTutor',
}

export default function PlansPage() {
  return (
    <div className="space-y-6">
      <PlansPageContent />
    </div>
  )
}
