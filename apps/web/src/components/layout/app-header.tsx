'use client'

import { Bell, PanelLeftClose, PanelLeftOpen, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { UserDropdown } from './user-dropdown'
import { ThemeToggle } from './theme-toggle'
import { useSidebar } from './sidebar-context'

interface AppHeaderProps {
  user: {
    name: string
    email: string
    image: string | null
    subscription: { planName: string } | null
  }
}

export function AppHeader({ user }: AppHeaderProps) {
  const { collapsed, toggleCollapsed, setMobileOpen } = useSidebar()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b px-4 md:px-6">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu"
        >
          <Menu className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="hidden md:inline-flex"
          onClick={toggleCollapsed}
          aria-label={collapsed ? 'Expandir sidebar' : 'Recolher sidebar'}
        >
          {collapsed ? (
            <PanelLeftOpen className="h-4 w-4" />
          ) : (
            <PanelLeftClose className="h-4 w-4" />
          )}
        </Button>
      </div>

      <div className="flex items-center gap-1">
        <ThemeToggle />
        <Button variant="ghost" size="icon" aria-label="Notificações">
          <Bell className="h-4 w-4" />
        </Button>
        <UserDropdown
          name={user.name}
          email={user.email}
          image={user.image}
          subscriptionPlanName={user.subscription?.planName ?? null}
        />
      </div>
    </header>
  )
}
