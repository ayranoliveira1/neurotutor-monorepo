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
import { updatePlanAction } from '@/actions/admin/update-plan'
import type { AdminPlan } from '@/actions/admin/list-plans-admin'

interface TogglePlanDialogProps {
  plan: AdminPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function TogglePlanDialog({
  plan,
  open,
  onOpenChange,
  onSuccess,
}: TogglePlanDialogProps) {
  const willActivate = plan ? !plan.active : false

  const { execute, isPending } = useAction(updatePlanAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao alterar status do plano')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {willActivate ? 'Ativar plano' : 'Inativar plano'}
          </DialogTitle>
          <DialogDescription asChild>
            <p>
              Tem certeza que deseja {willActivate ? 'ativar' : 'inativar'} o
              plano <strong>{plan?.name}</strong>?
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              plan &&
              execute({
                id: plan.id,
                active: willActivate ? 'true' : 'false',
              })
            }
          >
            {isPending
              ? willActivate
                ? 'Ativando...'
                : 'Inativando...'
              : willActivate
                ? 'Ativar'
                : 'Inativar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
