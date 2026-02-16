'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, Loader2 } from 'lucide-react'
import type { AdminUser } from '@/actions/admin/list-users'
import { useUsersQuery } from '@/hooks/admin/use-users-query'
import { usePlansQuery } from '@/hooks/admin/use-plans-query'
import { UsersFilters } from './users-filters'
import { UsersTable } from './users-table'
import { UsersPagination } from './users-pagination'
import { CreateUserDialog } from './create-user-dialog'
import { EditUserDialog } from './edit-user-dialog'
import { DeleteUserDialog } from './delete-user-dialog'

export function UsersPageContent() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const page = Number(searchParams.get('page')) || 1
  const search = searchParams.get('search') ?? ''
  const role = searchParams.get('role') ?? ''
  const active = searchParams.get('active') ?? ''
  const planId = searchParams.get('planId') ?? ''
  const startDate = searchParams.get('startDate') ?? ''
  const endDate = searchParams.get('endDate') ?? ''

  const usersQuery = useUsersQuery({
    page,
    perPage: 10,
    search: search || undefined,
    role: role || undefined,
    active: active || undefined,
    planId: planId || undefined,
    startDate: startDate || undefined,
    endDate: endDate || undefined,
  })
  const plansQuery = usePlansQuery()

  const [createOpen, setCreateOpen] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [deleteUser, setDeleteUser] = useState<AdminUser | null>(null)

  function invalidateUsers() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  }

  function handleCreateSuccess() {
    toast.success('Usuário criado com sucesso')
    invalidateUsers()
  }

  function handleEditSuccess() {
    toast.success('Usuário atualizado com sucesso')
    invalidateUsers()
  }

  function handleDeleteSuccess() {
    toast.success('Usuário excluído com sucesso')
    invalidateUsers()
  }

  if (usersQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (usersQuery.isError) {
    const message =
      usersQuery.error instanceof Error
        ? usersQuery.error.message
        : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  const { users, totalPages, currentPage, totalItems } = usersQuery.data!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Usuários</h2>
          <p className="text-muted-foreground">
            Gerencie os usuários da plataforma.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="icon"
          className="sm:size-auto sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Criar usuário</span>
        </Button>
      </div>

      <UsersFilters plans={plansQuery.data ?? []} />

      <UsersTable users={users} onEdit={setEditUser} onDelete={setDeleteUser} />

      {totalPages > 1 && (
        <UsersPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      )}

      <CreateUserDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        plans={plansQuery.data ?? []}
        onSuccess={handleCreateSuccess}
      />

      <EditUserDialog
        user={editUser}
        open={!!editUser}
        onOpenChange={(open) => !open && setEditUser(null)}
        onSuccess={handleEditSuccess}
        plans={plansQuery.data ?? []}
      />

      <DeleteUserDialog
        user={deleteUser}
        open={!!deleteUser}
        onOpenChange={(open) => !open && setDeleteUser(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
