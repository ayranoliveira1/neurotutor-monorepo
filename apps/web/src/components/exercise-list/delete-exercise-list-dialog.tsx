'use client'

import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { deleteExerciseListAction } from '@/actions/exercise-list/delete-exercise-list'
import type { ExerciseListItem } from '@/actions/exercise-list/types'

interface DeleteExerciseListDialogProps {
  exerciseList: ExerciseListItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteExerciseListDialog({
  exerciseList,
  open,
  onOpenChange,
  onSuccess,
}: DeleteExerciseListDialogProps) {
  const { execute, isPending } = useAction(deleteExerciseListAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao excluir lista')
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir lista de exercícios</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          Tem certeza que deseja excluir a lista{' '}
          <strong>{exerciseList?.name}</strong>? Esta ação não pode ser
          desfeita.
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => exerciseList && execute({ id: exerciseList.id })}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
