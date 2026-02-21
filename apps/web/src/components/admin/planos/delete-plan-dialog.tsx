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
import { deletePlanAction } from '@/actions/admin/planos/delete-plan'
import type { AdminPlan } from '@/actions/admin/planos/list-plans-admin'

interface DeletePlanDialogProps {
  plan: AdminPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeletePlanDialog({
  plan,
  open,
  onOpenChange,
  onSuccess,
}: DeletePlanDialogProps) {
  const { execute, isPending } = useAction(deletePlanAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao excluir plano')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir plano</DialogTitle>
          <DialogDescription asChild>
            <p>
              Tem certeza que deseja excluir o plano{' '}
              <strong>{plan?.name}</strong>? Esta ação não pode ser desfeita.
            </p>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => plan && execute({ id: plan.id })}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
