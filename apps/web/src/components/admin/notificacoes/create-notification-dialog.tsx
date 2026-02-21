'use client'

import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { adminCreateNotificationSchema } from '@/schemas/notification'
import { createNotificationAction } from '@/actions/admin/create-notification'
import { UserMultiSelect } from '../user-multi-select'

interface CreateNotificationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateNotificationDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateNotificationDialogProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    createNotificationAction,
    zodResolver(adminCreateNotificationSchema),
    {
      formProps: {
        defaultValues: {
          title: '',
          message: '',
          sendToAll: false,
          sendIds: [],
        },
      },
      actionProps: {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          onSuccess()
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao criar notificação')
        },
      },
    },
  )

  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = form

  const sendToAll = watch('sendToAll')
  const sendIds = watch('sendIds') ?? []

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova notificação</DialogTitle>
          <DialogDescription>
            Crie uma notificação para enviar aos usuários.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="notif-title">Título</Label>
            <Input
              id="notif-title"
              placeholder="Título da notificação"
              {...register('title')}
            />
            {errors.title && (
              <p className="text-sm text-destructive">
                {errors.title.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notif-message">Mensagem</Label>
            <textarea
              id="notif-message"
              placeholder="Conteúdo da notificação"
              rows={4}
              className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              {...register('message')}
            />
            {errors.message && (
              <p className="text-sm text-destructive">
                {errors.message.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="notif-send-all"
              className="h-4 w-4 rounded border-input"
              {...register('sendToAll')}
            />
            <Label htmlFor="notif-send-all" className="cursor-pointer">
              Enviar para todos os usuários
            </Label>
          </div>

          {!sendToAll && (
            <div className="space-y-2">
              <Label>Destinatários</Label>
              <UserMultiSelect
                value={sendIds}
                onChange={(ids) => setValue('sendIds', ids)}
              />
              {errors.sendIds && (
                <p className="text-sm text-destructive">
                  {errors.sendIds.message}
                </p>
              )}
            </div>
          )}

          {action.result?.serverError && (
            <p className="text-sm text-destructive">
              {action.result.serverError}
            </p>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </>
              ) : (
                'Enviar notificação'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
