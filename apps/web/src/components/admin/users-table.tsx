'use client'

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Calendar, Mail } from 'lucide-react'
import type { AdminUser } from '@/actions/admin/list-users'
import { UserRoleBadge } from './user-role-badge'
import { UserActionsDropdown } from './user-actions-dropdown'

interface UsersTableProps {
  users: AdminUser[]
  onEdit: (user: AdminUser) => void
  onDelete: (user: AdminUser) => void
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  if (users.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center rounded-md border text-muted-foreground">
        Nenhum usuário encontrado.
      </div>
    )
  }

  return (
    <>
      {/* Desktop: tabela */}
      <div className="hidden md:block overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>E-mail</TableHead>
              <TableHead>Papel</TableHead>
              <TableHead>Plano</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Criado em</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <UserRoleBadge role={user.role} />
                </TableCell>
                <TableCell>
                  {user.subscription?.planName ?? '—'}
                </TableCell>
                <TableCell>
                  {user.subscription ? (
                    <Badge
                      variant={
                        user.subscription.active ? 'default' : 'secondary'
                      }
                    >
                      {user.subscription.active ? 'Ativo' : 'Inativo'}
                    </Badge>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  {new Date(user.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <UserActionsDropdown
                    user={user}
                    onEdit={() => onEdit(user)}
                    onDelete={() => onDelete(user)}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile: cards */}
      <div className="grid gap-3 md:hidden">
        {users.map((user) => (
          <div
            key={user.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{user.name}</p>
                <div className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5 shrink-0" />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
              <UserActionsDropdown
                user={user}
                onEdit={() => onEdit(user)}
                onDelete={() => onDelete(user)}
              />
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <UserRoleBadge role={user.role} />
              {user.subscription ? (
                <>
                  <Badge
                    variant={
                      user.subscription.active ? 'default' : 'secondary'
                    }
                  >
                    {user.subscription.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                  <Badge variant="outline">
                    {user.subscription.planName}
                  </Badge>
                </>
              ) : (
                <Badge variant="outline">Sem plano</Badge>
              )}
            </div>

            <div className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
              <Calendar className="h-3.5 w-3.5" />
              <span>
                Criado em{' '}
                {new Date(user.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
