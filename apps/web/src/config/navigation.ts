import {
  Home,
  Users,
  CreditCard,
  Star,
  Bell,
  ClipboardList,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  href: string
  icon: LucideIcon
}

export interface NavGroup {
  title: string
  items: NavItem[]
  adminOnly?: boolean
}

export const navigationGroups: NavGroup[] = [
  {
    title: 'Menu',
    items: [
      { label: 'Home', href: '/home', icon: Home },
      { label: 'Listas de Exercícios', href: '/listas', icon: ClipboardList },
    ],
  },
  {
    title: 'Administração',
    adminOnly: true,
    items: [
      { label: 'Usuários', href: '/admin/usuarios', icon: Users },
      { label: 'Planos', href: '/admin/planos', icon: CreditCard },
      { label: 'Avaliações', href: '/admin/avaliacoes', icon: Star },
      { label: 'Notificações', href: '/admin/notificacoes', icon: Bell },
    ],
  },
]

export function getNavigationGroups(role: string | null): NavGroup[] {
  return navigationGroups.filter(
    (group) => !group.adminOnly || role === 'ADMIN'
  )
}
