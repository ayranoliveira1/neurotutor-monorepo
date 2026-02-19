'use client'

import { useRouter } from 'next/navigation'
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
import { Plus, Trash2 } from 'lucide-react'
import { createExerciseListSchema } from '@/schemas/exercise-list'
import { createExerciseListAction } from '@/actions/exercise-list/create-exercise-list'
import {
  useSubjectsQuery,
  useYearsQuery,
  useDifficultiesQuery,
} from '@/hooks/use-questions-metadata-query'

const difficultyLabels: Record<string, string> = {
  EASY: 'Fácil',
  MEDIUM: 'Médio',
  HARD: 'Difícil',
}

interface CreateExerciseListDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

export function CreateExerciseListDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateExerciseListDialogProps) {
  const router = useRouter()
  const { data: subjects } = useSubjectsQuery()
  const { data: years } = useYearsQuery()
  const { data: difficulties } = useDifficultiesQuery()

  const { form, handleSubmitWithAction, action } = useHookFormAction(
    createExerciseListAction,
    zodResolver(createExerciseListSchema),
    {
      formProps: {
        defaultValues: {
          name: '',
          shuffleQuestions: false,
          ignoreAnswered: false,
          sections: [{ subject: '', quantity: 10 }],
        },
      },
      actionProps: {
        onSuccess: ({ data }) => {
          onOpenChange(false)
          form.reset()
          onSuccess()
          if (data?.exerciseList) {
            router.push(`/listas/${data.exerciseList.id}/resolver`)
          }
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao criar lista')
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
    name: 'sections',
  })

  function handleOpenChange(value: boolean) {
    if (!value) form.reset()
    onOpenChange(value)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nova lista de exercícios</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome da lista</Label>
            <Input
              id="name"
              placeholder="Ex: Revisão ENEM 2025"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                {...register('shuffleQuestions')}
                className="rounded border-input"
              />
              Embaralhar questões
            </label>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Seções</Label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => append({ subject: '', quantity: 10 })}
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
                    Seção {index + 1}
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

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1">
                    <Label className="text-xs">Disciplina</Label>
                    <select
                      {...register(`sections.${index}.subject`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Selecione...</option>
                      {subjects?.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                    {errors.sections?.[index]?.subject && (
                      <p className="text-xs text-destructive">
                        {errors.sections[index].subject?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Quantidade</Label>
                    <Input
                      type="number"
                      min={1}
                      max={100}
                      {...register(`sections.${index}.quantity`, {
                        valueAsNumber: true,
                      })}
                    />
                    {errors.sections?.[index]?.quantity && (
                      <p className="text-xs text-destructive">
                        {errors.sections[index].quantity?.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Ano</Label>
                    <select
                      {...register(`sections.${index}.year`, {
                        setValueAs: (v: string) =>
                          v === '' ? undefined : Number(v),
                      })}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Todos</option>
                      {years?.map((y) => (
                        <option key={y} value={y}>
                          {y}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <Label className="text-xs">Dificuldade</Label>
                    <select
                      {...register(`sections.${index}.difficulty`)}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      <option value="">Todas</option>
                      {difficulties?.map((d) => (
                        <option key={d} value={d}>
                          {difficultyLabels[d] ?? d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            ))}

            {errors.sections?.message && (
              <p className="text-sm text-destructive">
                {errors.sections.message}
              </p>
            )}
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
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? 'Criando...' : 'Criar lista'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
