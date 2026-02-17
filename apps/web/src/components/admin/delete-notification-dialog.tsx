'use client'

import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { adminDeleteNotificationAction } from '@/actions/admin/delete-notification'
import type { AdminNotification } from '@/actions/admin/list-notifications'

interface DeleteNotificationDialogProps {
  notification: AdminNotification | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteNotificationDialog({
  notification,
  open,
  onOpenChange,
  onSuccess,
}: DeleteNotificationDialogProps) {
  const { execute, isPending } = useAction(adminDeleteNotificationAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao excluir notificação')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir notificação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a notificação{' '}
            <strong>{notification?.title}</strong>? Esta ação não pode ser
            desfeita e a notificação será removida para todos os destinatários.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => notification && execute({ id: notification.id })}
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Excluindo...
              </>
            ) : (
              'Excluir'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
