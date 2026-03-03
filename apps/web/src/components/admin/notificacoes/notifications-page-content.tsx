'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { AlertCircle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { AdminNotification } from '@/actions/admin/notificacoes/list-notifications'
import { useNotificationsAdminQuery } from '@/hooks/admin/use-notifications-admin-query'
import { NotificationsTable } from './notifications-table'
import { NotificationsPagination } from './notifications-pagination'
import { DeleteNotificationDialog } from './delete-notification-dialog'
import { CreateNotificationDialog } from './create-notification-dialog'
import { NotificationsPageSkeleton } from './notifications-page-skeleton'

export function NotificationsPageContent() {
  const queryClient = useQueryClient()
  const searchParams = useSearchParams()

  const page = Number(searchParams.get('page') ?? '1')
  const perPage = 10

  const notificationsQuery = useNotificationsAdminQuery({ page, perPage })

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteNotification, setDeleteNotification] =
    useState<AdminNotification | null>(null)

  function handleCreateSuccess() {
    toast.success('Notificação enviada com sucesso')
    queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] })
  }

  function handleDeleteSuccess() {
    toast.success('Notificação excluída com sucesso')
    queryClient.invalidateQueries({ queryKey: ['admin', 'notifications'] })
  }

  if (notificationsQuery.isLoading) {
    return <NotificationsPageSkeleton />
  }

  if (notificationsQuery.isError) {
    const message =
      notificationsQuery.error instanceof Error
        ? notificationsQuery.error.message
        : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  const data = notificationsQuery.data

  if (!data) return null

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Notificações</h2>
          <p className="text-muted-foreground">
            Gerencie as notificações enviadas aos usuários.
          </p>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova notificação
        </Button>
      </div>

      <NotificationsTable
        notifications={data.notifications}
        onDelete={setDeleteNotification}
      />

      {data.totalPages > 1 && (
        <NotificationsPagination
          currentPage={data.currentPage}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
        />
      )}

      <CreateNotificationDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      <DeleteNotificationDialog
        notification={deleteNotification}
        open={!!deleteNotification}
        onOpenChange={(open) => !open && setDeleteNotification(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
