'use client'

import { useEffect } from 'react'
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
import { Select } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { adminUpdatePlanSchema } from '@/schemas/admin'
import { updatePlanAction } from '@/actions/admin/planos/update-plan'
import type { AdminPlan } from '@/actions/admin/planos/list-plans-admin'

interface EditPlanDialogProps {
  plan: AdminPlan | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const cycleOptions = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
]

const activeOptions = [
  { value: 'true', label: 'Ativo' },
  { value: 'false', label: 'Inativo' },
]

export function EditPlanDialog({
  plan,
  open,
  onOpenChange,
  onSuccess,
}: EditPlanDialogProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    updatePlanAction,
    zodResolver(adminUpdatePlanSchema),
    {
      formProps: {
        defaultValues: {
          id: '',
          name: '',
          slug: '',
          priceCents: 0,
          description: '',
          cycle: undefined,
          active: undefined,
        },
      },
      actionProps: {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess()
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao atualizar plano')
        },
      },
    },
  )

  const {
    register,
    formState: { errors },
    reset,
  } = form

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  useEffect(() => {
    if (plan && open) {
      reset({
        id: plan.id,
        name: plan.name,
        slug: plan.slug,
        priceCents: plan.priceCents,
        description: plan.description ?? '',
        cycle: plan.cycle as 'WEEKLY' | 'MONTHLY' | 'YEARLY',
        active: (plan.active ? 'true' : 'false') as 'true' | 'false',
      })
    }
  }, [plan, open, reset])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar plano</DialogTitle>
          <DialogDescription>
            Altere os dados do plano.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <input type="hidden" {...register('id')} />

          <div className="space-y-2">
            <Label htmlFor="edit-plan-name">Nome</Label>
            <Input
              id="edit-plan-name"
              placeholder="Nome do plano"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plan-slug">Slug</Label>
            <Input
              id="edit-plan-slug"
              placeholder="slug-do-plano"
              {...register('slug')}
            />
            {errors.slug && (
              <p className="text-sm text-destructive">
                {errors.slug.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-plan-price">Preço (centavos)</Label>
              <Input
                id="edit-plan-price"
                type="number"
                min={0}
                placeholder="2990"
                {...register('priceCents')}
              />
              {errors.priceCents && (
                <p className="text-sm text-destructive">
                  {errors.priceCents.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-plan-cycle">Ciclo</Label>
              <Select
                id="edit-plan-cycle"
                options={cycleOptions}
                {...register('cycle')}
              />
              {errors.cycle && (
                <p className="text-sm text-destructive">
                  {errors.cycle.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plan-description">Descrição</Label>
            <Input
              id="edit-plan-description"
              placeholder="Descrição do plano"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-plan-active">Status</Label>
            <Select
              id="edit-plan-active"
              options={activeOptions}
              {...register('active')}
            />
            {errors.active && (
              <p className="text-sm text-destructive">
                {errors.active.message}
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
              {action.isPending ? 'Salvando...' : 'Salvar alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
