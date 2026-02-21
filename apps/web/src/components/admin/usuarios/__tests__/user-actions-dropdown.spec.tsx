import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UserActionsDropdown } from '../user-actions-dropdown'

vi.mock('@/components/ui/dropdown-menu', () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
  }: {
    children: React.ReactNode
    onClick?: () => void
  }) => <button onClick={onClick}>{children}</button>,
}))

vi.mock('@/components/ui/button', () => ({
  Button: ({
    children,
    'aria-label': ariaLabel,
  }: {
    children: React.ReactNode
    'aria-label'?: string
  }) => <button aria-label={ariaLabel}>{children}</button>,
}))

vi.mock('lucide-react', () => ({
  MoreHorizontal: () => <span>...</span>,
  Pencil: () => <span />,
  Trash2: () => <span />,
}))

const mockUser = {
  id: 'u1',
  name: 'João Silva',
  email: 'joao@test.com',
  image: null,
  role: 'STUDENT' as const,
  emailVerified: true,
  createdAt: '2025-01-01',
  updatedAt: '2025-01-01',
  subscription: null,
}

describe('UserActionsDropdown', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deve renderizar botão de ações com aria-label', () => {
    render(
      <UserActionsDropdown
        user={mockUser}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(
      screen.getByLabelText('Ações de João Silva'),
    ).toBeInTheDocument()
  })

  it('deve renderizar opções Editar e Excluir', () => {
    render(
      <UserActionsDropdown
        user={mockUser}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    )

    expect(screen.getByText('Editar')).toBeInTheDocument()
    expect(screen.getByText('Excluir')).toBeInTheDocument()
  })

  it('deve chamar onEdit ao clicar em Editar', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(
      <UserActionsDropdown
        user={mockUser}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    )

    await user.click(screen.getByText('Editar'))

    expect(onEdit).toHaveBeenCalledOnce()
  })

  it('deve chamar onDelete ao clicar em Excluir', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <UserActionsDropdown
        user={mockUser}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    )

    await user.click(screen.getByText('Excluir'))

    expect(onDelete).toHaveBeenCalledOnce()
  })
})
