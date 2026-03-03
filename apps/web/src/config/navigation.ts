import {
  Home,
  Users,
  CreditCard,
  Star,
  Bell,
  ClipboardList,
  HelpCircle,
  Target,
  Timer,
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
      { label: 'Planos de Estudo', href: '/planos-estudo', icon: Target },
      { label: 'Modo Foco', href: '/pomodoro', icon: Timer },
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
      { label: 'Questões', href: '/admin/questoes', icon: HelpCircle },
    ],
  },
]

export function getNavigationGroups(role: string | null): NavGroup[] {
  return navigationGroups.filter(
    (group) => !group.adminOnly || role === 'ADMIN'
  )
}
