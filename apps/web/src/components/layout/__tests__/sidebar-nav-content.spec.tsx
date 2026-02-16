import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SidebarNavContent } from '../sidebar-nav-content'
import { navigationGroups } from '@/config/navigation'

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

describe('SidebarNavContent', () => {
  it('should render logo text', () => {
    render(<SidebarNavContent pathname="/dashboard" />)

    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
  })

  it('should render all navigation group titles', () => {
    render(<SidebarNavContent pathname="/dashboard" />)

    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)

    for (const group of navigationGroups) {
      expect(headingTexts).toContain(group.title)
    }
  })

  it('should render all navigation items as links', () => {
    render(<SidebarNavContent pathname="/dashboard" />)

    const allItems = navigationGroups.flatMap((g) => g.items)
    for (const item of allItems) {
      const link = screen.getByRole('link', { name: item.label })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    }
  })

  it('should highlight active item based on pathname', () => {
    render(<SidebarNavContent pathname="/home" />)

    const activeLink = screen.getByRole('link', { name: 'Home' })
    expect(activeLink.className).toContain('bg-primary')
  })

  it('should show short logo "N" when collapsed', () => {
    render(<SidebarNavContent pathname="/dashboard" collapsed={true} />)

    expect(screen.queryByText('NeuroTutor')).not.toBeInTheDocument()
    expect(screen.getByText('N')).toBeInTheDocument()
  })

  it('should hide group titles when collapsed', () => {
    render(<SidebarNavContent pathname="/dashboard" collapsed={true} />)

    expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
  })

  it('should call onNavigate when a link is clicked', async () => {
    const user = userEvent.setup()
    const onNavigate = vi.fn()

    render(<SidebarNavContent pathname="/dashboard" onNavigate={onNavigate} />)

    const link = screen.getByRole('link', { name: 'Home' })
    await user.click(link)

    expect(onNavigate).toHaveBeenCalledTimes(1)
  })
})
