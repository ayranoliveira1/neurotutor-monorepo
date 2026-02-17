import { Suspense } from 'react'
import type { Metadata } from 'next'
import { UsersPageContent } from '@/components/admin/users-page-content'
import { UsersPageSkeleton } from '@/components/admin/users-page-skeleton'

export const metadata: Metadata = {
  title: 'Usuários | Admin | NeuroTutor',
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <Suspense fallback={<UsersPageSkeleton />}>
        <UsersPageContent />
      </Suspense>
    </div>
  )
}
