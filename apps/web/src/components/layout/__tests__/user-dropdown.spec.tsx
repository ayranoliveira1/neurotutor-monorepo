import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserDropdown } from '../user-dropdown'

vi.mock('@/actions/auth/sign-out', () => ({
  signOutAction: vi.fn(),
}))

const mockUser = {
  name: 'Maria Silva',
  email: 'maria@email.com',
  image: null,
  subscriptionPlanName: 'Pro',
}

describe('UserDropdown', () => {
  it('should render the trigger with avatar initials', () => {
    render(<UserDropdown {...mockUser} />)

    expect(screen.getByText('MS')).toBeInTheDocument()
    expect(screen.getByLabelText('Menu do usuário')).toBeInTheDocument()
  })

  it('should show dropdown content when clicked', async () => {
    const user = userEvent.setup()
    render(<UserDropdown {...mockUser} />)

    await user.click(screen.getByLabelText('Menu do usuário'))

    expect(screen.getByText('Pro')).toBeInTheDocument()
    expect(screen.getByText('Sair')).toBeInTheDocument()
  })

  it('should render single initial for single-word name', () => {
    render(
      <UserDropdown
        name="João"
        email="joao@email.com"
        image={null}
        subscriptionPlanName={null}
      />
    )

    expect(screen.getByText('J')).toBeInTheDocument()
  })

  it('should show fallback initials when no image is provided', () => {
    render(
      <UserDropdown
        name="Ana Costa"
        email="ana@email.com"
        image={null}
        subscriptionPlanName={null}
      />
    )

    expect(screen.getByText('AC')).toBeInTheDocument()
  })
})
