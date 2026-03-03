'use client'

import { useState, useMemo, useEffect } from 'react'
import { Bell, ArrowLeft, Trash2, Loader2 } from 'lucide-react'
import { useQueryClient } from '@tanstack/react-query'
import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { useNotificationsQuery } from '@/hooks/use-notifications-query'
import { readNotificationAction } from '@/actions/notifications/read-notification'
import { readAllNotificationsAction } from '@/actions/notifications/read-all-notifications'
import { deleteNotificationAction } from '@/actions/notifications/delete-notification'
import type { UserNotification } from '@/actions/notifications/fetch-notifications'

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()

  if (diffMs < 0) return 'agora'

  const diffMin = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'agora'
  if (diffMin < 60) return `${diffMin}min`
  if (diffHours < 24) return `${diffHours}h`
  if (diffDays < 30) return `${diffDays}d`
  return date.toLocaleDateString('pt-BR')
}

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedNotification, setSelectedNotification] =
    useState<UserNotification | null>(null)

  const queryClient = useQueryClient()
  const { data, isLoading } = useNotificationsQuery()

  const readAction = useAction(readNotificationAction)
  const readAllAction = useAction(readAllNotificationsAction)
  const deleteAction = useAction(deleteNotificationAction)

  const notifications = data?.notifications ?? []

  const unreadCount = useMemo(() => {
    return notifications.filter((n) => !n.readAt).length
  }, [notifications])

  useEffect(() => {
    function handleOpenNotifications() {
      setOpen(true)
    }

    window.addEventListener('open-notifications', handleOpenNotifications)
    return () => {
      window.removeEventListener('open-notifications', handleOpenNotifications)
    }
  }, [])

  function invalidateNotifications() {
    queryClient.invalidateQueries({ queryKey: ['notifications'] })
  }

  async function handleClickNotification(notification: UserNotification) {
    try {
      if (!notification.readAt) {
        await readAction.executeAsync({ id: notification.id })
        invalidateNotifications()
      }

      setSelectedNotification(notification)
      setView('detail')
    } catch {
      toast.error('Erro ao marcar notificação como lida')
    }
  }

  async function handleReadAll() {
    try {
      await readAllAction.executeAsync({})
      invalidateNotifications()
    } catch {
      toast.error('Erro ao marcar notificações como lidas')
    }
  }

  async function handleDelete(notificationId: string) {
    try {
      await deleteAction.executeAsync({ id: notificationId })
      invalidateNotifications()
      setView('list')
      setSelectedNotification(null)
    } catch {
      toast.error('Erro ao excluir notificação')
    }
  }

  function handleOpenChange(isOpen: boolean) {
    setOpen(isOpen)
    if (!isOpen) {
      setView('list')
      setSelectedNotification(null)
    }
  }

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          aria-label="Notificações"
        >
          <Bell className="h-4 w-4" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-medium text-white">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="end" className="w-80 p-0">
        {view === 'list' ? (
          <div className="flex flex-col">
            <div className="flex items-center justify-between px-4 py-3">
              <h3 className="text-sm font-semibold">Notificações</h3>
              {unreadCount > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {unreadCount} não lida{unreadCount > 1 ? 's' : ''}
                </Badge>
              )}
            </div>

            <Separator />

            <div className="notification-scroll max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-sm text-muted-foreground">
                    Nenhuma notificação
                  </p>
                </div>
              ) : (
                notifications.map((notification) => (
                  <button
                    type="button"
                    key={notification.id}
                    onClick={() => handleClickNotification(notification)}
                    className="flex w-full items-start gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                  >
                    {!notification.readAt && (
                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    )}
                    <div
                      className={`flex-1 ${notification.readAt ? 'pl-5' : ''}`}
                    >
                      <p className="text-sm font-medium leading-tight">
                        {notification.title}
                      </p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                        {notification.content}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground/70">
                        {formatTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                  </button>
                ))
              )}
            </div>

            {unreadCount > 0 && (
              <>
                <Separator />
                <div className="p-2">
                  <Button
                    type="button"
                    size="sm"
                    className="w-full text-xs"
                    onClick={handleReadAll}
                    disabled={readAllAction.isPending}
                  >
                    {readAllAction.isPending ? (
                      <>
                        <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                        Marcando...
                      </>
                    ) : (
                      'Ler todas'
                    )}
                  </Button>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="flex items-center gap-2 px-4 py-3">
              <Button
                variant="ghost"
                size="icon"
                type="button"
                className="h-7 w-7"
                aria-label="Voltar para lista"
                onClick={() => {
                  setView('list')
                  setSelectedNotification(null)
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <h3 className="text-sm font-semibold">Detalhes</h3>
            </div>

            <Separator />

            {selectedNotification && (
              <div className="notification-scroll max-h-80 overflow-y-auto px-4 py-3">
                <h4 className="text-sm font-semibold">
                  {selectedNotification.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground/70">
                  {new Date(selectedNotification.createdAt).toLocaleString(
                    'pt-BR',
                    {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    },
                  )}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {selectedNotification.content}
                </p>
              </div>
            )}

            <Separator />

            <div className="p-2">
              <Button
                variant="destructive"
                size="sm"
                type="button"
                className="w-full text-xs"
                onClick={() =>
                  selectedNotification &&
                  handleDelete(selectedNotification.id)
                }
                disabled={deleteAction.isPending}
              >
                {deleteAction.isPending ? (
                  <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="mr-1 h-3 w-3" />
                )}
                {deleteAction.isPending ? 'Excluindo...' : 'Excluir'}
              </Button>
            </div>
          </div>
        )}
      </PopoverContent>
    </Popover>
  )
}
