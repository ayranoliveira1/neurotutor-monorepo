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
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { adminUpdateUserSchema } from '@/schemas/admin'
import { updateUserAction } from '@/actions/admin/usuarios/update-user'
import type { AdminUser } from '@/actions/admin/usuarios/list-users'
import type { Plan } from '@/actions/admin/planos/list-plans'

interface EditUserDialogProps {
  user: AdminUser | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess: () => void
  plans: Plan[]
}

const roleOptions = [
  { value: 'STUDENT', label: 'Aluno' },
  { value: 'TEACHER', label: 'Professor' },
  { value: 'ADMIN', label: 'Admin' },
]

const activeOptions = [
  { value: 'true', label: 'Ativo' },
  { value: 'false', label: 'Inativo' },
]

function formatDateForInput(dateStr: string | undefined): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return date.toISOString().split('T')[0]
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  onSuccess,
  plans,
}: EditUserDialogProps) {
  const { form, handleSubmitWithAction, action } = useHookFormAction(
    updateUserAction,
    zodResolver(adminUpdateUserSchema),
    {
      formProps: {
        defaultValues: {
          id: '',
          name: '',
          email: '',
          role: undefined,
          planId: undefined,
          endDate: undefined,
          active: undefined,
        },
      },
      actionProps: {
        onSuccess: () => {
          onOpenChange(false)
          onSuccess()
        },
        onError: ({ error }) => {
          toast.error(error.serverError ?? 'Erro ao atualizar usuário')
        },
      },
    }
  )

  const { register, formState: { errors }, reset } = form

  const planOptions = plans
    .filter((p) => p.active)
    .map((p) => ({ value: p.id, label: p.name }))

  function handleOpenChange(open: boolean) {
    if (!open) form.reset()
    onOpenChange(open)
  }

  useEffect(() => {
    if (user && open) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        role: (user.role as 'ADMIN' | 'STUDENT' | 'TEACHER') ?? undefined,
        planId: user.subscription?.planId ?? undefined,
        endDate: formatDateForInput(user.subscription?.endDate) || undefined,
        active: user.subscription
          ? (user.subscription.active ? 'true' : 'false') as 'true' | 'false'
          : undefined,
      })
    }
  }, [user, open, reset])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar usuário</DialogTitle>
          <DialogDescription>
            Altere os dados do usuário e sua assinatura.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmitWithAction} className="space-y-4">
          <input type="hidden" {...register('id')} />

          <div className="space-y-2">
            <Label htmlFor="edit-name">Nome</Label>
            <Input
              id="edit-name"
              placeholder="Nome completo"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-email">E-mail</Label>
            <Input
              id="edit-email"
              type="email"
              placeholder="usuario@email.com"
              {...register('email')}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-role">Papel</Label>
            <Select
              id="edit-role"
              options={roleOptions}
              {...register('role')}
            />
            {errors.role && (
              <p className="text-sm text-destructive">{errors.role.message}</p>
            )}
          </div>

          {user?.subscription && (
            <>
              <Separator />

              <p className="text-sm font-medium">Assinatura</p>

              <div className="space-y-2">
                <Label htmlFor="edit-plan">Plano</Label>
                <Select
                  id="edit-plan"
                  options={planOptions}
                  placeholder="Selecione um plano"
                  {...register('planId')}
                />
                {errors.planId && (
                  <p className="text-sm text-destructive">
                    {errors.planId.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-endDate">Data de validade</Label>
                  <Input
                    id="edit-endDate"
                    type="date"
                    {...register('endDate')}
                  />
                  {errors.endDate && (
                    <p className="text-sm text-destructive">
                      {errors.endDate.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-active">Status</Label>
                  <Select
                    id="edit-active"
                    options={activeOptions}
                    {...register('active')}
                  />
                  {errors.active && (
                    <p className="text-sm text-destructive">
                      {errors.active.message}
                    </p>
                  )}
                </div>
              </div>
            </>
          )}

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
