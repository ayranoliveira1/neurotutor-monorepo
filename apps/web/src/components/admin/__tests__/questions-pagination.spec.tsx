import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QuestionsPagination } from '../questions-pagination'

const mockReplace = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/admin/questoes',
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

describe('QuestionsPagination', () => {
  it('deve renderizar info de total de itens', () => {
    render(
      <QuestionsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )
    expect(screen.getByText('50 questões encontradas')).toBeInTheDocument()
  })

  it('deve renderizar singular quando 1 item', () => {
    render(
      <QuestionsPagination
        currentPage={1}
        totalPages={1}
        totalItems={1}
      />,
    )
    expect(screen.getByText('1 questão encontrada')).toBeInTheDocument()
  })

  it('deve renderizar página atual e total', () => {
    render(
      <QuestionsPagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
      />,
    )
    expect(screen.getByText('Página 3 de 10')).toBeInTheDocument()
  })

  it('deve desabilitar botão anterior na primeira página', () => {
    render(
      <QuestionsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )
    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
  })

  it('deve desabilitar botão próximo na última página', () => {
    render(
      <QuestionsPagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
      />,
    )
    expect(screen.getByLabelText('Próxima página')).toBeDisabled()
  })

  it('deve habilitar ambos botões em página intermediária', () => {
    render(
      <QuestionsPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />,
    )
    expect(screen.getByLabelText('Página anterior')).not.toBeDisabled()
    expect(screen.getByLabelText('Próxima página')).not.toBeDisabled()
  })

  it('deve chamar router.replace ao clicar próxima página', async () => {
    const user = userEvent.setup()

    render(
      <QuestionsPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    await user.click(screen.getByLabelText('Próxima página'))

    expect(mockReplace).toHaveBeenCalledWith(
      '/admin/questoes?page=2',
      { scroll: false },
    )
  })

  it('deve chamar router.replace ao clicar página anterior', async () => {
    const user = userEvent.setup()

    render(
      <QuestionsPagination
        currentPage={3}
        totalPages={5}
        totalItems={50}
      />,
    )

    await user.click(screen.getByLabelText('Página anterior'))

    expect(mockReplace).toHaveBeenCalledWith(
      '/admin/questoes?page=2',
      { scroll: false },
    )
  })
})
