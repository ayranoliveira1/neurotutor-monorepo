import { getCurrentUser } from '@/actions/auth/get-current-user'
import { SubscriptionModal } from '@/components/subscription-modal'

export default async function SubGuardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const result = await getCurrentUser()

  const showModal =
    result.status === 'authenticated' &&
    result.user.subscription?.active !== true

  return (
    <>
      {children}
      {showModal && <SubscriptionModal />}
    </>
  )
}
