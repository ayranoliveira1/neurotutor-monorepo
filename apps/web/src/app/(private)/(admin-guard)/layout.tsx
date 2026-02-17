import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth/get-current-user'

export default async function AdminGuardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const result = await getCurrentUser()

  if (result.status !== 'authenticated' || result.user.role !== 'ADMIN') {
    redirect('/home')
  }

  return <>{children}</>
}
