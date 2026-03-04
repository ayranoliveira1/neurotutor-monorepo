import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/actions/auth/get-current-user'
import { generateClearSessionToken } from '@/lib/clear-session-token'
import { ThemeProvider } from '@/providers/theme-provider'
import { SocketProvider } from '@/providers/socket-provider'
import { SidebarProvider } from '@/components/layout/sidebar-context'
import { Sidebar } from '@/components/layout/sidebar'
import { MobileSidebar } from '@/components/layout/mobile-sidebar'
import { AppHeader } from '@/components/layout/app-header'
import { RatingPopup } from '@/components/rating/rating-popup'
import { NavigationGuardProvider } from '@/contexts/navigation-guard-context'
import { PomodoroProvider } from '@/contexts/pomodoro-context'
import { PomodoroFloatingPopup } from '@/components/pomodoro/pomodoro-floating-popup'

export default async function PrivateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const result = await getCurrentUser()

  if (result.status !== 'authenticated') {
    const token = generateClearSessionToken()
    redirect(`/api/auth/clear-session?token=${token}`)
  }

  const user = result.user

  return (
    <ThemeProvider>
      <SocketProvider userId={user?.id ?? ''}>
        <SidebarProvider userRole={user?.role ?? null}>
          <PomodoroProvider>
            <NavigationGuardProvider>
              <div className="flex min-h-screen">
                <Sidebar />
                <MobileSidebar />
                <div className="flex min-w-0 flex-1 flex-col">
                  {user && <AppHeader user={user} />}
                  <main className="flex-1 bg-muted/30 p-4 md:p-6">
                    {children}
                  </main>
                </div>
              </div>
              {user && <RatingPopup userId={user.id} />}
            </NavigationGuardProvider>
            <PomodoroFloatingPopup />
          </PomodoroProvider>
        </SidebarProvider>
      </SocketProvider>
    </ThemeProvider>
  )
}
