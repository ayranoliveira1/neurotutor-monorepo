import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StudyPlansPagination } from '../study-plans-pagination'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/planos-estudo',
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    onClick,
    disabled,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    onClick?: () => void
    disabled?: boolean
    'aria-label'?: string
  }) => (
    <button onClick={onClick} disabled={disabled} aria-label={ariaLabel}>
      {children}
    </button>
  ),
}))

describe('StudyPlansPagination', () => {
  it('deve renderizar informações de página', () => {
    render(
      <StudyPlansPagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('deve desabilitar botão anterior na primeira página', () => {
    render(
      <StudyPlansPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    const prevButton = screen.getByLabelText('Página anterior')
    expect(prevButton).toBeDisabled()
  })

  it('deve desabilitar botão próxima na última página', () => {
    render(
      <StudyPlansPagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
      />,
    )

    const nextButton = screen.getByLabelText('Próxima página')
    expect(nextButton).toBeDisabled()
  })

  it('deve exibir total de itens', () => {
    render(
      <StudyPlansPagination
        currentPage={1}
        totalPages={3}
        totalItems={25}
      />,
    )

    expect(screen.getByText(/25 planos encontrados/i)).toBeInTheDocument()
  })

  it('deve navegar para a página anterior ao clicar', async () => {
    const user = userEvent.setup()

    render(
      <StudyPlansPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />,
    )

    await user.click(screen.getByLabelText('Página anterior'))

    expect(mockPush).toHaveBeenCalledWith('/planos-estudo?page=2')
  })

  it('deve navegar para a próxima página ao clicar', async () => {
    const user = userEvent.setup()

    render(
      <StudyPlansPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />,
    )

    await user.click(screen.getByLabelText('Próxima página'))

    expect(mockPush).toHaveBeenCalledWith('/planos-estudo?page=4')
  })
})
