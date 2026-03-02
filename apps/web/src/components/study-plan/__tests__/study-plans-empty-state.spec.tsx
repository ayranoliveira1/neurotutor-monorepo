import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudyPlansEmptyState } from '../study-plans-empty-state'

vi.mock('framer-motion', () => ({
  motion: {
    div: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <div className={className}>{children}</div>,
    h3: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <h3 className={className}>{children}</h3>,
    p: ({
      children,
      className,
    }: {
      children: React.ReactNode
      className?: string
    }) => <p className={className}>{children}</p>,
  },
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

describe('StudyPlansEmptyState', () => {
  it('deve renderizar mensagem quando não há filtros', () => {
    render(
      <StudyPlansEmptyState
        hasActiveFilters={false}
        onCreateNew={vi.fn()}
      />,
    )

    expect(screen.getByText('Organize seus estudos!')).toBeInTheDocument()
    expect(
      screen.getByText(/Crie seu primeiro plano de estudo/),
    ).toBeInTheDocument()
  })

  it('deve renderizar botão de criar e chamar onCreateNew', async () => {
    const user = userEvent.setup()
    const onCreateNew = vi.fn()

    render(
      <StudyPlansEmptyState
        hasActiveFilters={false}
        onCreateNew={onCreateNew}
      />,
    )

    await user.click(screen.getByText('Criar primeiro plano'))

    expect(onCreateNew).toHaveBeenCalledOnce()
  })

  it('deve renderizar mensagem de filtros quando há filtros ativos', () => {
    render(
      <StudyPlansEmptyState
        hasActiveFilters={true}
        onCreateNew={vi.fn()}
      />,
    )

    expect(
      screen.getByText('Nenhum resultado encontrado'),
    ).toBeInTheDocument()
  })
})
