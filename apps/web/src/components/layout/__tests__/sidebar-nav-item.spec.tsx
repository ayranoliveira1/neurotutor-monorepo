import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SidebarNavItem } from '../sidebar-nav-item'
import { LayoutDashboard } from 'lucide-react'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode
    href: string
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/contexts/navigation-guard-context', () => ({
  useNavigationGuard: () => ({
    isBlocked: false,
    requestNavigation: (fn: () => void) => fn(),
  }),
}))

describe('SidebarNavItem', () => {
  it('should render with label and link', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={false}
      />
    )

    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/dashboard')
  })

  it('should apply active styles when isActive is true', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={true}
      />
    )

    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link.className).toContain('bg-primary')
    expect(link.className).toContain('font-medium')
  })

  it('should not apply active styles when isActive is false', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={false}
      />
    )

    const link = screen.getByRole('link', { name: /dashboard/i })
    expect(link.className).not.toContain('font-medium')
  })

  it('should render the icon', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={false}
      />
    )

    const link = screen.getByRole('link', { name: /dashboard/i })
    const svg = link.querySelector('svg')
    expect(svg).toBeInTheDocument()
  })

  it('should hide label when collapsed', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={false}
        collapsed={true}
      />
    )

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument()
    const link = screen.getByRole('link')
    expect(link).toHaveAttribute('title', 'Dashboard')
    expect(link.querySelector('svg')).toBeInTheDocument()
  })

  it('should center icon when collapsed', () => {
    render(
      <SidebarNavItem
        href="/dashboard"
        icon={LayoutDashboard}
        label="Dashboard"
        isActive={false}
        collapsed={true}
      />
    )

    const link = screen.getByRole('link')
    expect(link.className).toContain('justify-center')
  })
})
