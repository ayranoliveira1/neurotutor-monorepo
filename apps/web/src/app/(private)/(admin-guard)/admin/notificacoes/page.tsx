import { Suspense } from 'react'
import type { Metadata } from 'next'
import { NotificationsPageContent } from '@/components/admin/notificacoes/notifications-page-content'
import { NotificationsPageSkeleton } from '@/components/admin/notificacoes/notifications-page-skeleton'

export const metadata: Metadata = {
  title: 'Notificações | Admin | NeuroTutor',
}

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<NotificationsPageSkeleton />}>
        <NotificationsPageContent />
      </Suspense>
    </div>
  )
}
