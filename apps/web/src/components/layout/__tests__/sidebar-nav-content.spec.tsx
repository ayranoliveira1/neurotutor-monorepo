import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarNavContent } from '../sidebar-nav-content'
import { SidebarProvider } from '../sidebar-context'
import { getNavigationGroups } from '@/config/navigation'

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    onClick,
    ...props
  }: {
    children: React.ReactNode
    href: string
    onClick?: () => void
  }) => (
    <a href={href} onClick={onClick} {...props}>
      {children}
    </a>
  ),
}))

function renderWithProvider(
  ui: React.ReactElement,
  { userRole = null }: { userRole?: string | null } = {}
) {
  return render(
    <SidebarProvider userRole={userRole}>{ui}</SidebarProvider>
  )
}

describe('SidebarNavContent', () => {
  it('should render logo text', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />)

    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
  })

  it('should render non-admin navigation group titles for student', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />, {
      userRole: 'STUDENT',
    })

    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)

    const groups = getNavigationGroups('STUDENT')
    for (const group of groups) {
      expect(headingTexts).toContain(group.title)
    }
    expect(headingTexts).not.toContain('Administração')
  })

  it('should render all navigation group titles for admin', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />, {
      userRole: 'ADMIN',
    })

    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)

    expect(headingTexts).toContain('Menu')
    expect(headingTexts).toContain('Administração')
  })

  it('should render navigation items as links', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />)

    const groups = getNavigationGroups(null)
    const allItems = groups.flatMap((g) => g.items)
    for (const item of allItems) {
      const link = screen.getByRole('link', { name: item.label })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    }
  })

  it('should highlight active item based on pathname', () => {
    renderWithProvider(<SidebarNavContent pathname="/home" />)

    const activeLink = screen.getByRole('link', { name: 'Home' })
    expect(activeLink.className).toContain('bg-primary')
  })

  it('should show short logo "N" when collapsed', () => {
    renderWithProvider(
      <SidebarNavContent pathname="/dashboard" collapsed={true} />
    )

    expect(screen.queryByText('NeuroTutor')).not.toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('should hide group titles when collapsed', () => {
    renderWithProvider(
      <SidebarNavContent pathname="/dashboard" collapsed={true} />
    )

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('should call onNavigate when a link is clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    renderWithProvider(
      <SidebarNavContent pathname="/dashboard" onNavigate={onNavigate} />
    )

    const link = screen.getByRole('link', { name: 'Home' })
    await user.click(link)

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })

  it('should not show admin items for non-admin users', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />, {
      userRole: 'STUDENT',
    })

    expect(screen.queryByRole('link', { name: 'Usuários' })).not.toBeInTheDocument()
  })

  it('should show admin items for admin users', () => {
    renderWithProvider(<SidebarNavContent pathname="/dashboard" />, {
      userRole: 'ADMIN',
    })

    expect(screen.getByRole('link', { name: 'Usuários' })).toBeInTheDocument()
  })
})
