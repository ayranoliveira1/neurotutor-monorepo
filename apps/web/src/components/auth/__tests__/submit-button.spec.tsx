import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { SubmitButton } from '../submit-button'

describe('SubmitButton', () => {
  it('should render the label when not pending', () => {
    render(
      <SubmitButton
        isPending={false}
        label="Entrar"
        pendingLabel="Entrando..."
      />
    )

    expect(screen.getByRole('button', { name: 'Entrar' })).toBeInTheDocument()
    expect(screen.getByRole('button')).not.toBeDisabled()
  })

  it('should render the pending label when pending', () => {
    render(
      <SubmitButton
        isPending={true}
        label="Entrar"
        pendingLabel="Entrando..."
      />
    )

    expect(
      screen.getByRole('button', { name: /Entrando/i })
    ).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('should be a submit button', () => {
    render(
      <SubmitButton
        isPending={false}
        label="Entrar"
        pendingLabel="Entrando..."
      />
    )

    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
