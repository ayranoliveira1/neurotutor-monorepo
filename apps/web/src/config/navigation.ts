import { Home, type LucideIcon } from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  title: string
  items: NavItem[]
}

export const navigationGroups: NavGroup[] = [
  {
    title: 'Menu',
    items: [{ label: 'Home', href: '/home', icon: Home }],
  },
]
