import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MobileSidebar } from '../mobile-sidebar'
import { SidebarProvider, useSidebar } from '../sidebar-context'

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

vi.mock('next/navigation', () => ({
  usePathname: () => '/dashboard',
  useRouter: () => ({ push: vi.fn() }),
}))

vi.mock('@/contexts/navigation-guard-context', () => ({
  useNavigationGuard: () => ({
    isBlocked: false,
    requestNavigation: (fn: () => void) => fn(),
  }),
}))

function OpenButton() {
  const { setMobileOpen } = useSidebar()
  return (
    <button onClick={() => setMobileOpen(true)} data-testid="open-btn">
      Open
    </button>
  )
}

describe('MobileSidebar', () => {
  it('should not render content when closed', () => {
    render(
      <SidebarProvider>
        <MobileSidebar />
      </SidebarProvider>
    )

    expect(screen.queryByText('NeuroTutor')).not.toBeInTheDocument()
  })

  it('should render navigation content when opened', async () => {
    const user = userEvent.setup()

    render(
      <SidebarProvider>
        <OpenButton />
        <MobileSidebar />
      </SidebarProvider>
    )

    await user.click(screen.getByTestId('open-btn'))

    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
  })

  it('should close when a navigation item is clicked', async () => {
    const user = userEvent.setup()

    render(
      <SidebarProvider>
        <OpenButton />
        <MobileSidebar />
      </SidebarProvider>
    )

    await user.click(screen.getByTestId('open-btn'))
    expect(screen.getByText('NeuroTutor')).toBeInTheDocument()

    const homeLink = screen.getByRole('link', { name: 'Home' })
    await user.click(homeLink)

    expect(screen.queryByText('NeuroTutor')).not.toBeInTheDocument()
  })
})
