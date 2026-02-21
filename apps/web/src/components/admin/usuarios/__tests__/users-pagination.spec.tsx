import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersPagination } from '../users-pagination'

const mockPush = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/admin/usuarios',
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

vi.mock('lucide-react', () => ({
  ChevronLeft: () => <span>&lt;</span>,
  ChevronRight: () => <span>&gt;</span>,
}))

describe('UsersPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    window.scrollTo = vi.fn()
  })

  it('deve renderizar total de usuários no singular', () => {
    render(
      <UsersPagination
        currentPage={1}
        totalPages={1}
        totalItems={1}
      />,
    )

    expect(screen.getByText('1 usuário encontrado')).toBeInTheDocument()
  })

  it('deve renderizar total de usuários no plural', () => {
    render(
      <UsersPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(
      screen.getByText('50 usuários encontrados'),
    ).toBeInTheDocument()
  })

  it('deve renderizar informação de página atual', () => {
    render(
      <UsersPagination
        currentPage={3}
        totalPages={10}
        totalItems={100}
      />,
    )

    expect(screen.getByText('Página 3 de 10')).toBeInTheDocument()
  })

  it('deve desabilitar botão anterior na primeira página', () => {
    render(
      <UsersPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(screen.getByLabelText('Página anterior')).toBeDisabled()
  })

  it('deve desabilitar botão próxima na última página', () => {
    render(
      <UsersPagination
        currentPage={5}
        totalPages={5}
        totalItems={50}
      />,
    )

    expect(screen.getByLabelText('Próxima página')).toBeDisabled()
  })

  it('deve chamar router.push ao clicar em próxima página', async () => {
    const user = userEvent.setup()

    render(
      <UsersPagination
        currentPage={1}
        totalPages={5}
        totalItems={50}
      />,
    )

    await user.click(screen.getByLabelText('Próxima página'))

    expect(mockPush).toHaveBeenCalledWith(
      '/admin/usuarios?page=2',
    )
  })
})
