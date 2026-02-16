'use client'

import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Plus, AlertCircle, Loader2 } from 'lucide-react'
import type { AdminPlan } from '@/actions/admin/list-plans-admin'
import { usePlansAdminQuery } from '@/hooks/admin/use-plans-admin-query'
import { PlansTable } from './plans-table'
import { CreatePlanDialog } from './create-plan-dialog'
import { EditPlanDialog } from './edit-plan-dialog'
import { DeletePlanDialog } from './delete-plan-dialog'
import { TogglePlanDialog } from './toggle-plan-dialog'

export function PlansPageContent() {
  const queryClient = useQueryClient()

  const plansQuery = usePlansAdminQuery()

  const [createOpen, setCreateOpen] = useState(false)
  const [editPlan, setEditPlan] = useState<AdminPlan | null>(null)
  const [deletePlan, setDeletePlan] = useState<AdminPlan | null>(null)
  const [togglePlan, setTogglePlan] = useState<AdminPlan | null>(null)

  function invalidatePlans() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'plans'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'plans', 'manage'] })
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
  }

  function handleCreateSuccess() {
    toast.success('Plano criado com sucesso')
    invalidatePlans()
  }

  function handleEditSuccess() {
    toast.success('Plano atualizado com sucesso')
    invalidatePlans()
  }

  function handleDeleteSuccess() {
    toast.success('Plano excluído com sucesso')
    invalidatePlans()
  }

  function handleToggleSuccess() {
    const wasActive = togglePlan?.active
    toast.success(
      wasActive ? 'Plano inativado com sucesso' : 'Plano ativado com sucesso',
    )
    invalidatePlans()
  }

  if (plansQuery.isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (plansQuery.isError) {
    const message =
      plansQuery.error instanceof Error
        ? plansQuery.error.message
        : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  const plans = plansQuery.data!

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Planos</h2>
          <p className="text-muted-foreground">
            Gerencie os planos da plataforma.
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
          size="icon"
          className="sm:size-auto sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Criar plano</span>
        </Button>
      </div>

      <PlansTable
        plans={plans}
        onEdit={setEditPlan}
        onDelete={setDeletePlan}
        onToggleActive={setTogglePlan}
      />

      <CreatePlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditPlanDialog
        plan={editPlan}
        open={!!editPlan}
        onOpenChange={(open) => !open && setEditPlan(null)}
        onSuccess={handleEditSuccess}
      />

      <DeletePlanDialog
        plan={deletePlan}
        open={!!deletePlan}
        onOpenChange={(open) => !open && setDeletePlan(null)}
        onSuccess={handleDeleteSuccess}
      />

      <TogglePlanDialog
        plan={togglePlan}
        open={!!togglePlan}
        onOpenChange={(open) => !open && setTogglePlan(null)}
        onSuccess={handleToggleSuccess}
      />
    </div>
  )
}
