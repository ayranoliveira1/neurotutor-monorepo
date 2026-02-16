import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { AppHeader } from '../app-header'
import { SidebarProvider } from '../sidebar-context'

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
  usePathname: () => '/dashboard',
}))

vi.mock('@/actions/auth/sign-out', () => ({
  signOutAction: vi.fn(),
}))

const mockUser = {
  name: 'Maria Silva',
  email: 'maria@email.com',
  image: null,
  subscription: { planName: 'Pro' },
}

function renderHeader() {
  return render(
    <SidebarProvider>
      <AppHeader user={mockUser} />
    </SidebarProvider>
  )
}

describe('AppHeader', () => {
  it('should render the notification button', () => {
    renderHeader()

    expect(screen.getByLabelText('Notificações')).toBeInTheDocument()
  })

  it('should render the sidebar toggle button', () => {
    renderHeader()

    expect(screen.getByLabelText('Recolher sidebar')).toBeInTheDocument()
  })

  it('should toggle sidebar label on click', async () => {
    const user = userEvent.setup()
    renderHeader()

    const toggleBtn = screen.getByLabelText('Recolher sidebar')
    await user.click(toggleBtn)

    expect(screen.getByLabelText('Expandir sidebar')).toBeInTheDocument()
  })

  it('should render the user dropdown avatar', () => {
    renderHeader()

    expect(screen.getByText('MS')).toBeInTheDocument()
    expect(screen.getByLabelText('Menu do usuário')).toBeInTheDocument()
  })

  it('should render the mobile hamburger menu button', () => {
    renderHeader()

    expect(screen.getByLabelText('Abrir menu')).toBeInTheDocument()
  })
})
