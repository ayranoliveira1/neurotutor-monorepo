import type { Metadata } from 'next'
import { RatingsPageContent } from '@/components/admin/ratings-page-content'

export const metadata: Metadata = {
  title: 'Avaliações | Admin | NeuroTutor',
}

export default function RatingsPage() {
  return (
    <div className="space-y-6">
      <RatingsPageContent />
    </div>
  )
}
