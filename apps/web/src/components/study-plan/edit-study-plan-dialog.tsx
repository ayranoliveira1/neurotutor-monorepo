'use client'

import { useFieldArray } from 'react-hook-form'
import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { editStudyPlanSchema } from '@/schemas/study-plan'
import { editStudyPlanAction } from '@/actions/study-plan/edit-study-plan'
import { useSubjectsQuery } from '@/hooks/use-questions-metadata-query'
import type { StudyPlanItem } from '@/actions/study-plan/types'
import { z } from 'zod'

const editFormSchema = editStudyPlanSchema.extend({
  id: z.string().min(1),
})

interface EditStudyPlanDialogProps {
  studyPlan: StudyPlanItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

function formatDateForInput(dateStr: string) {
  return dateStr.split('T')[0]
}

export function EditStudyPlanDialog({
  studyPlan,
  open,
  onOpenChange,
  onSuccess,
}: EditStudyPlanDialogProps) {
  const { data: subjects } = useSubjectsQuery()

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    editStudyPlanAction,
    zodResolver(editFormSchema),
    {
      formProps: {
        values: studyPlan
          ? {
              id: studyPlan.id,
              name: studyPlan.name,
              description: studyPlan.description ?? '',
              startDate: formatDateForInput(studyPlan.startDate),
              endDate: formatDateForInput(studyPlan.endDate),
              goals: studyPlan.goals.map((g) => ({
                subject: g.subject,
                weeklyQuestionsTarget: g.weeklyQuestionsTarget,
                targetAccuracyPercent: g.targetAccuracyPercent,
              })),
            }
          : undefined,
      },
      actionProps: {
        onSuccess: () => {
          onSuccess()
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao editar plano de estudo')
        },
      },
    },
  )

  const {
    register,
    formState: { errors },
  } = form

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'goals',
  })

  function handleOpenChange(value: boolean) {
    if (!value) form.reset()
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar plano de estudo</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <input type="hidden" {...register('id')} />

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome do plano</Label>
            <Input id="edit-name" {...register('name')} />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Descrição (opcional)</Label>
            <Input id="edit-description" {...register('description')} />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-start">Data de início</Label>
              <Input
                id="edit-start"
                type="date"
                {...register('startDate')}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-end">Data de término</Label>
              <Input
                id="edit-end"
                type="date"
                {...register('endDate')}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Metas por disciplina</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({ subject: '', weeklyQuestionsTarget: 10 })
                }
              >
                <Plus className="mr-1 h-3.5 w-3.5" />
                Adicionar
              </Button>
            </div>

            {fields.map((field, index) => (
              <div
                key={field.id}
                className="rounded-md border p-3 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Meta {index + 1}
                  </span>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Disciplina</Label>
                    <select
                      {...register(`goals.${index}.subject`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecione...</option>
                      {subjects?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.goals?.[index]?.subject && (
                      <p className="text-xs text-destructive">
                        {errors.goals[index].subject?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Questões/semana</Label>
                    <Input
                      type="number"
                      min={1}
                      max={500}
                      {...register(`goals.${index}.weeklyQuestionsTarget`, {
                        valueAsNumber: true,
                      })}
                    />
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">% acertos (opcional)</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...register(`goals.${index}.targetAccuracyPercent`, {
                        setValueAs: (v: string) =>
                          v === '' ? undefined : Number(v),
                      })}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

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
              disabled={action.isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
