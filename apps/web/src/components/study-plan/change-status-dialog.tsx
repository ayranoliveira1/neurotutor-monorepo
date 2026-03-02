'use client'

import { useAction } from 'next-safe-action/hooks'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { changeStudyPlanStatusAction } from '@/actions/study-plan/change-study-plan-status'
import type { StudyPlanItem } from '@/actions/study-plan/types'

interface ChangeStatusDialogProps {
  studyPlan: StudyPlanItem | null
  targetStatus: 'COMPLETED' | 'ARCHIVED'
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const statusLabels = {
  COMPLETED: {
    title: 'Concluir plano de estudo',
    description: 'Tem certeza que deseja marcar este plano como concluído?',
    button: 'Concluir',
    loadingButton: 'Concluindo...',
  },
  ARCHIVED: {
    title: 'Arquivar plano de estudo',
    description:
      'Tem certeza que deseja arquivar este plano? Você poderá criar um novo plano depois.',
    button: 'Arquivar',
    loadingButton: 'Arquivando...',
  },
}

export function ChangeStatusDialog({
  studyPlan,
  targetStatus,
  open,
  onOpenChange,
  onSuccess,
}: ChangeStatusDialogProps) {
  const { execute, isPending } = useAction(changeStudyPlanStatusAction, {
    onSuccess: () => {
      onOpenChange(false)
      onSuccess()
    },
    onError: ({ error }) => {
      toast.error(error.serverError ?? 'Erro ao alterar status do plano')
    },
  })

  const labels = statusLabels[targetStatus]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{labels.title}</DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground">
          {labels.description}
          {studyPlan && (
            <>
              {' '}
              Plano: <strong>{studyPlan.name}</strong>
            </>
          )}
        </p>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            disabled={isPending}
            onClick={() =>
              studyPlan &&
              execute({ id: studyPlan.id, status: targetStatus })
            }
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {labels.loadingButton}
              </>
            ) : (
              labels.button
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
