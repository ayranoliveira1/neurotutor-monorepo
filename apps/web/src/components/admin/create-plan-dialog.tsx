'use client'

import { useHookFormAction } from '@next-safe-action/adapter-react-hook-form/hooks'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { adminCreatePlanSchema } from '@/schemas/admin'
import { createPlanAction } from '@/actions/admin/create-plan'

interface CreatePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
}

const cycleOptions = [
  { value: 'WEEKLY', label: 'Semanal' },
  { value: 'MONTHLY', label: 'Mensal' },
  { value: 'YEARLY', label: 'Anual' },
]

export function CreatePlanDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreatePlanDialogProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    createPlanAction,
    zodResolver(adminCreatePlanSchema),
    {
      formProps: {
        defaultValues: {
          name: '',
          slug: '',
          priceCents: 0,
          description: '',
          cycle: 'MONTHLY',
        },
      },
      actionProps: {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          onSuccess()
        },
      },
    },
  )

  const {
    register,
    formState: { errors },
  } = form

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar plano</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo plano.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-plan-name">Nome</Label>
            <Input
              id="create-plan-name"
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
            <Label htmlFor="create-plan-slug">Slug</Label>
            <Input
              id="create-plan-slug"
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
              <Label htmlFor="create-plan-price">Preço (centavos)</Label>
              <Input
                id="create-plan-price"
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
              <Label htmlFor="create-plan-cycle">Ciclo</Label>
              <Select
                id="create-plan-cycle"
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
            <Label htmlFor="create-plan-description">Descrição</Label>
            <Input
              id="create-plan-description"
              placeholder="Descrição do plano (opcional)"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
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
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={action.isPending}>
              {action.isPending ? 'Criando...' : 'Criar plano'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
