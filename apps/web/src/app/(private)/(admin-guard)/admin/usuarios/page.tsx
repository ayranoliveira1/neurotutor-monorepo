import type { Metadata } from 'next'
import { UsersPageContent } from '@/components/admin/users-page-content'

export const metadata: Metadata = {
  title: 'Usuários | Admin | NeuroTutor',
}

export default function AdminUsersPage() {
  return (
    <div className="space-y-6">
      <UsersPageContent />
    </div>
  )
}
