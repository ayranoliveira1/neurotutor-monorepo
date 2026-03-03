import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Sidebar } from '../sidebar'
import { SidebarProvider, useSidebar } from '../sidebar-context'
import { getNavigationGroups } from '@/config/navigation'

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

const mockUsePathname = vi.fn()
vi.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/contexts/navigation-guard-context', () => ({
  useNavigationGuard: () => ({
    isBlocked: false,
    requestNavigation: (fn: () => void) => fn(),
  }),
}))

function renderSidebar() {
  return render(
    <SidebarProvider>
      <Sidebar />
    </SidebarProvider>
  )
}

describe('Sidebar', () => {
  beforeEach(() => {
    mockUsePathname.mockReturnValue('/dashboard')
  })

  it('should render the logo', () => {
    renderSidebar()
    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
  })

  it('should render all navigation group titles', () => {
    renderSidebar()

    const headings = screen.getAllByRole('heading', { level: 3 })
    const headingTexts = headings.map((h) => h.textContent)

    const groups = getNavigationGroups(null)
    for (const group of groups) {
      expect(headingTexts).toContain(group.title)
    }
  })

  it('should render all navigation items as links', () => {
    renderSidebar()

    const groups = getNavigationGroups(null)
    const allItems = groups.flatMap((g) => g.items)
    for (const item of allItems) {
      const link = screen.getByRole('link', { name: item.label })
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', item.href)
    }
  })

  it('should highlight the active item based on pathname', () => {
    mockUsePathname.mockReturnValue('/home')
    renderSidebar()

    const activeLink = screen.getByRole('link', { name: 'Home' })
    expect(activeLink.className).toContain('bg-primary')
  })

  it('should render the correct number of items', () => {
    renderSidebar()

    const groups = getNavigationGroups(null)
    const totalItems = groups.reduce((sum, g) => sum + g.items.length, 0)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(totalItems)
  })

  describe('collapsed state', () => {
    function CollapsibleSidebar() {
      const { toggleCollapsed } = useSidebar()
      return (
        <>
          <Sidebar />
          <button onClick={toggleCollapsed} data-testid="toggle" />
        </>
      )
    }

    function renderCollapsible() {
      return render(
        <SidebarProvider>
          <CollapsibleSidebar />
        </SidebarProvider>
      )
    }

    it('should show short logo "N" when collapsed', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
      expect(screen.queryByText('N')).not.toBeInTheDocument()

      await user.click(screen.getByTestId('toggle'))

      expect(screen.queryByText('NeuroTutor')).not.toBeInTheDocument()
      expect(screen.getByText('N')).toBeInTheDocument()
    })

    it('should hide group titles when collapsed', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      expect(
        screen.getAllByRole('heading', { level: 3 }).length
      ).toBeGreaterThan(0)

      await user.click(screen.getByTestId('toggle'))

      expect(screen.queryAllByRole('heading', { level: 3 })).toHaveLength(0)
    })

    it('should hide link labels when collapsed', async () => {
      const user = userEvent.setup()
      renderCollapsible()

      expect(screen.getByText('Home')).toBeInTheDocument()

      await user.click(screen.getByTestId('toggle'))

      expect(screen.queryByText('Home')).not.toBeInTheDocument()
    })
  })
})
