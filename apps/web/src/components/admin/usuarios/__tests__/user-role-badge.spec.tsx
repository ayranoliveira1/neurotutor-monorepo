import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { UserRoleBadge } from '../user-role-badge'

describe('UserRoleBadge', () => {
  it('should render "Admin" for ADMIN role', () => {
    render(<UserRoleBadge role="ADMIN" />)
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })

  it('should render "Aluno" for STUDENT role', () => {
    render(<UserRoleBadge role="STUDENT" />)
    expect(screen.getByText('Aluno')).toBeInTheDocument()
  })

  it('should render "Professor" for TEACHER role', () => {
    render(<UserRoleBadge role="TEACHER" />)
    expect(screen.getByText('Professor')).toBeInTheDocument()
  })

  it('should render "Sem papel" for null role', () => {
    render(<UserRoleBadge role={null} />)
    expect(screen.getByText('Sem papel')).toBeInTheDocument()
  })

  it('should render the raw role for unknown values', () => {
    render(<UserRoleBadge role="CUSTOM" />)
    expect(screen.getByText('CUSTOM')).toBeInTheDocument()
  })
})
