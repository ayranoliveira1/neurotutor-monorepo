import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SignOutButton } from '../sign-out-button'

vi.mock('@/actions/auth/sign-out', () => ({
  signOutAction: vi.fn(),
}))

describe('SignOutButton', () => {
  it('should render a submit button with "Sair" text', () => {
    render(<SignOutButton />)

    const button = screen.getByRole('button', { name: /Sair/i })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'submit')
  })

  it('should be wrapped in a form', () => {
    const { container } = render(<SignOutButton />)

    const form = container.querySelector('form')
    expect(form).toBeInTheDocument()
  })
})
