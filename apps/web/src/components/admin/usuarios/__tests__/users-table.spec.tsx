import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { UsersTable } from '../users-table'
import type { AdminUser } from '@/actions/admin/usuarios/list-users'

const mockUsers: AdminUser[] = [
  {
    id: '1',
    name: 'Maria Silva',
    email: 'maria@email.com',
    image: null,
    role: 'ADMIN',
    emailVerified: true,
    createdAt: '2025-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
    subscription: {
      id: 'sub-1',
      planId: 'plan-1',
      planName: 'Premium',
      endDate: '2026-01-15T00:00:00.000Z',
      active: true,
    },
  },
  {
    id: '2',
    name: 'João Santos',
    email: 'joao@email.com',
    image: null,
    role: 'STUDENT',
    emailVerified: false,
    createdAt: '2025-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
    subscription: null,
  },
]

describe('UsersTable', () => {
  it('should render empty message when no users', () => {
    render(<UsersTable users={[]} onEdit={vi.fn()} onDelete={vi.fn()} />)
    expect(screen.getByText('Nenhum usuário encontrado.')).toBeInTheDocument()
  })

  it('should render user rows', () => {
    render(
      <UsersTable users={mockUsers} onEdit={vi.fn()} onDelete={vi.fn()} />
    )
    // Cada usuário aparece na tabela (desktop) e no card (mobile)
    expect(screen.getAllByText('Maria Silva')).toHaveLength(2)
    expect(screen.getAllByText('maria@email.com')).toHaveLength(2)
    expect(screen.getAllByText('João Santos')).toHaveLength(2)
    expect(screen.getAllByText('joao@email.com')).toHaveLength(2)
  })

  it('should render role badges', () => {
    render(
      <UsersTable users={mockUsers} onEdit={vi.fn()} onDelete={vi.fn()} />
    )
    expect(screen.getAllByText('Admin')).toHaveLength(2)
    expect(screen.getAllByText('Aluno')).toHaveLength(2)
  })

  it('should render subscription info', () => {
    render(
      <UsersTable users={mockUsers} onEdit={vi.fn()} onDelete={vi.fn()} />
    )
    expect(screen.getAllByText('Premium')).toHaveLength(2)
    expect(screen.getAllByText('Ativo')).toHaveLength(2)
    // Tabela: 2x "—" (plano e status do João), Card: 1x "Sem plano"
    expect(screen.getAllByText('—')).toHaveLength(2)
    expect(screen.getByText('Sem plano')).toBeInTheDocument()
  })

  it('should call onEdit when edit action is clicked', async () => {
    const user = userEvent.setup()
    const onEdit = vi.fn()

    render(
      <UsersTable users={mockUsers} onEdit={onEdit} onDelete={vi.fn()} />
    )

    const actionButtons = screen.getAllByLabelText(/Ações de/)
    await user.click(actionButtons[0])
    await user.click(screen.getByText('Editar'))

    expect(onEdit).toHaveBeenCalledWith(mockUsers[0])
  })

  it('should call onDelete when delete action is clicked', async () => {
    const user = userEvent.setup()
    const onDelete = vi.fn()

    render(
      <UsersTable users={mockUsers} onEdit={vi.fn()} onDelete={onDelete} />
    )

    const actionButtons = screen.getAllByLabelText(/Ações de/)
    await user.click(actionButtons[0])
    await user.click(screen.getByText('Excluir'))

    expect(onDelete).toHaveBeenCalledWith(mockUsers[0])
  })
})
