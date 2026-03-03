'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useNavigationGuard } from '@/contexts/navigation-guard-context'

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
  const router = useRouter()
  const { isBlocked, requestNavigation } = useNavigationGuard()

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (isBlocked) {
      e.preventDefault()
      requestNavigation(() => router.push(href))
      return
    }
    onClick?.()
  }

  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      onClick={handleClick}
      className={cn(
        'flex items-center rounded-lg text-sm transition-colors',
        collapsed ? 'justify-center px-2 py-2' : 'gap-3 px-3 py-2',
        isActive
          ? 'bg-primary text-primary-foreground font-medium'
          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground',
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      {!collapsed && label}
    </Link>
  )
}
