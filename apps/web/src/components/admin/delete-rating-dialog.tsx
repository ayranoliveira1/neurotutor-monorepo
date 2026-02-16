'use client'

import { useAction } from 'next-safe-action/hooks'
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
import { deleteRatingAction } from '@/actions/admin/delete-rating'
import type { AdminRating } from '@/actions/admin/list-ratings'

interface DeleteRatingDialogProps {
  rating: AdminRating | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function DeleteRatingDialog({
  rating,
  open,
  onOpenChange,
  onSuccess,
}: DeleteRatingDialogProps) {
  const { execute, isPending } = useAction(deleteRatingAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir avaliação</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir a avaliação de{' '}
            <strong>{rating?.userName}</strong>? Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => rating && execute({ id: rating.id })}
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
