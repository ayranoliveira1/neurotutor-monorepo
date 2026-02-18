import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ExerciseListsPagination } from '../exercise-lists-pagination'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/listas',
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

describe('ExerciseListsPagination', () => {
  it('deve renderizar informações de página', () => {
    render(
      <ExerciseListsPagination
        currentPage={2}
        totalPages={5}
        totalItems={50}
      />
    )

    expect(screen.getByText('Página 2 de 5')).toBeInTheDocument()
  })

  it('deve desabilitar botão anterior na primeira página', () => {
    render(
      <ExerciseListsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />
    )

    const prevButton = screen.getByLabelText('Página anterior')
    expect(prevButton).toBeDisabled()
  })

  it('deve desabilitar botão próxima na última página', () => {
    render(
      <ExerciseListsPagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
      />
    )

    const nextButton = screen.getByLabelText('Próxima página')
    expect(nextButton).toBeDisabled()
  })

  it('deve habilitar ambos os botões em páginas intermediárias', () => {
    render(
      <ExerciseListsPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />
    )

    const prevButton = screen.getByLabelText('Página anterior')
    const nextButton = screen.getByLabelText('Próxima página')

    expect(prevButton).not.toBeDisabled()
    expect(nextButton).not.toBeDisabled()
  })

  it('deve exibir total de itens', () => {
    render(
      <ExerciseListsPagination
        currentPage={1}
        totalPages={3}
        totalItems={25}
      />
    )

    expect(screen.getByText(/25 listas encontradas/i)).toBeInTheDocument()
  })

  it('deve navegar para a página anterior ao clicar no botão anterior', async () => {
    const user = userEvent.setup()

    render(
      <ExerciseListsPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />
    )

    await user.click(screen.getByLabelText('Página anterior'))

    expect(mockPush).toHaveBeenCalledWith('/listas?page=2')
  })

  it('deve navegar para a próxima página ao clicar no botão próxima', async () => {
    const user = userEvent.setup()

    render(
      <ExerciseListsPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />
    )

    await user.click(screen.getByLabelText('Próxima página'))

    expect(mockPush).toHaveBeenCalledWith('/listas?page=4')
  })
})
