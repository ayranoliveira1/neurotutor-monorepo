'use client'

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
import { adminCreateUserSchema } from '@/schemas/admin'
import { createUserAction } from '@/actions/admin/usuarios/create-user'
import type { Plan } from '@/actions/admin/planos/list-plans'

interface CreateUserDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  plans: Plan[]
  onSuccess: () => void
}

const roleOptions = [
  { value: 'STUDENT', label: 'Aluno' },
  { value: 'TEACHER', label: 'Professor' },
  { value: 'ADMIN', label: 'Admin' },
]

export function CreateUserDialog({
  open,
  onOpenChange,
  plans,
  onSuccess,
}: CreateUserDialogProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    createUserAction,
    zodResolver(adminCreateUserSchema),
    {
      formProps: {
        defaultValues: {
          name: '',
          email: '',
          password: '',
          planSlug: '',
          durationDays: 30,
          role: 'STUDENT',
        },
      },
      actionProps: {
        onSuccess: () => {
          onOpenChange(false)
          form.reset()
          onSuccess()
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao criar usuário')
        },
      },
    }
  )

  const {
    register,
    formState: { errors },
  } = form

  const planOptions = plans
    .filter((p) => p.active)
    .map((p) => ({ value: p.slug, label: p.name }))

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Criar usuário</DialogTitle>
          <DialogDescription>
            Preencha os dados para criar um novo usuário.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="create-name">Nome</Label>
            <Input
              id="create-name"
              placeholder="Nome completo"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-email">E-mail</Label>
            <Input
              id="create-email"
              placeholder="usuario@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-password">Senha</Label>
            <Input
              id="create-password"
              type="password"
              placeholder="Mínimo 8 caracteres"
              {...register('password')}
            />
            {errors.password && (
              <p className="text-sm text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="create-plan">Plano</Label>
              <Select
                id="create-plan"
                options={planOptions}
                placeholder="Selecione um plano"
                {...register('planSlug')}
              />
              {errors.planSlug && (
                <p className="text-sm text-destructive">
                  {errors.planSlug.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-duration">Duração (dias)</Label>
              <Input
                id="create-duration"
                type="number"
                min={1}
                placeholder="30"
                {...register('durationDays')}
              />
              {errors.durationDays && (
                <p className="text-sm text-destructive">
                  {errors.durationDays.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="create-role">Papel</Label>
            <Select
              id="create-role"
              options={roleOptions}
              {...register('role')}
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
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
              {action.isPending ? 'Criando...' : 'Criar usuário'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
