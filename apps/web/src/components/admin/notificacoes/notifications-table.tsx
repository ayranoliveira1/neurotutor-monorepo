'use client'

import { Trash2, Calendar, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import type { AdminNotification } from '@/actions/admin/notificacoes/list-notifications'

interface NotificationsTableProps {
  notifications: AdminNotification[]
  onDelete: (notification: AdminNotification) => void
}

export function NotificationsTable({
  notifications,
  onDelete,
}: NotificationsTableProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex items-center justify-center rounded-md border border-dashed py-12">
        <p className="text-sm text-muted-foreground">
          Nenhuma notificação encontrada
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Desktop */}
      <div className="hidden overflow-x-auto md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Mensagem</TableHead>
              <TableHead>Destinatários</TableHead>
              <TableHead>Data</TableHead>
              <TableHead className="w-12" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {notifications.map((notification) => (
              <TableRow key={notification.id}>
                <TableCell className="max-w-48 truncate font-medium">
                  {notification.title}
                </TableCell>
                <TableCell className="max-w-64 truncate text-muted-foreground">
                  {notification.content}
                </TableCell>
                <TableCell>
                  <Badge variant="secondary">
                    <Users className="mr-1 h-3 w-3" />
                    {notification.destination.sendIds.length}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive hover:text-destructive"
                    onClick={() => onDelete(notification)}
                    aria-label="Excluir notificação"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile */}
      <div className="grid gap-3 md:hidden">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="rounded-lg border bg-card p-4 shadow-sm"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{notification.title}</p>
                <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                  {notification.content}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="shrink-0 text-destructive hover:text-destructive"
                onClick={() => onDelete(notification)}
                aria-label="Excluir notificação"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                {notification.destination.sendIds.length} destinatário
                {notification.destination.sendIds.length !== 1 ? 's' : ''}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {new Date(notification.createdAt).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
