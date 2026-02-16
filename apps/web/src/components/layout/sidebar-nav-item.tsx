'use client'

import Link from 'next/link'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarNavItemProps {
  href: string
  icon: LucideIcon
  label: string
  isActive: boolean
  collapsed?: boolean
  onClick?: () => void
}

export function SidebarNavItem({
  href,
  icon: Icon,
  label,
  isActive,
  collapsed = false,
  onClick,
}: SidebarNavItemProps) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={onClick}
      className={cn(
        'flex items-center rounded-lg text-sm transition-colors',
        collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground'
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && label}
    </Link>
  )
}
