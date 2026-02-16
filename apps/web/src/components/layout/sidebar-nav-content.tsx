'use client'

import { cn } from '@/lib/utils'
import { getNavigationGroups } from '@/config/navigation'
import { SidebarNavItem } from './sidebar-nav-item'
import { useSidebar } from './sidebar-context'

interface SidebarNavContentProps {
  pathname: string
  collapsed?: boolean
  onNavigate?: () => void
}

export function SidebarNavContent({
  pathname,
  collapsed = false,
  onNavigate,
}: SidebarNavContentProps) {
  const { userRole } = useSidebar()
  const groups = getNavigationGroups(userRole)

  return (
    <div className="flex h-full flex-col">
      <div className={cn('flex h-16 shrink-0 items-center', collapsed ? 'justify-center px-2' : 'px-6')}>
        {!collapsed && (
          <span className="text-lg font-semibold text-sidebar-foreground">
            NeuroTutor
          </span>
        )}
        {collapsed && (
          <span className="text-lg font-bold text-sidebar-foreground">N</span>
        )}
      </div>

      <nav className={cn('flex-1 overflow-y-auto pb-4', collapsed ? 'px-2' : 'px-3')}>
        {groups.map((group) => (
          <div key={group.title} className="mb-4">
            {!collapsed && (
              <h3 className="mb-2 px-3 text-xs font-semibold uppercase tracking-wider text-sidebar-foreground/50">
                {group.title}
              </h3>
            )}
            {collapsed && <div className="mb-2 border-b border-sidebar-border" />}
            <ul className="space-y-1">
              {group.items.map((item) => (
                <li key={item.href}>
                  <SidebarNavItem
                    href={item.href}
                    icon={item.icon}
                    label={item.label}
                    isActive={pathname === item.href}
                    collapsed={collapsed}
                    onClick={onNavigate}
                  />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>
    </div>
  )
}
