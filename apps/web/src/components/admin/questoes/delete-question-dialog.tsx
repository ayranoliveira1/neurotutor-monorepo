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
import { deleteQuestionAction } from '@/actions/admin/delete-question'

interface DeleteQuestionDialogProps {
  questionId: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteQuestionDialog({
  questionId,
  open,
  onOpenChange,
  onSuccess,
}: DeleteQuestionDialogProps) {
  const { execute, isPending } = useAction(deleteQuestionAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao excluir questão')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir questão</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir esta questão? Esta ação não pode ser
            desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => execute({ id: questionId })}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
