'use client'

import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'
import { useStudyPlansPage } from '@/hooks/use-study-plans-page'
import { StudyPlansTable } from './study-plans-table'
import { StudyPlansPagination } from './study-plans-pagination'
import { CreateStudyPlanDialog } from './create-study-plan-dialog'
import { EditStudyPlanDialog } from './edit-study-plan-dialog'
import { DeleteStudyPlanDialog } from './delete-study-plan-dialog'
import { ChangeStatusDialog } from './change-status-dialog'
import { StudyPlansPageSkeleton } from './study-plans-page-skeleton'
import { StudyPlansFilters } from './study-plans-filters'

export function StudyPlansPageContent() {
  const {
    isLoading,
    isError,
    error,
    studyPlans,
    totalPages,
    currentPage,
    totalItems,
    hasActiveFilters,
    createOpen,
    setCreateOpen,
    editItem,
    setEditItem,
    deleteItem,
    setDeleteItem,
    statusItem,
    setStatusItem,
    handleCreateSuccess,
    handleEditSuccess,
    handleDeleteSuccess,
    handleStatusSuccess,
    openCreateDialog,
  } = useStudyPlansPage()

  if (isLoading) {
    return <StudyPlansPageSkeleton />
  }

  if (isError) {
    const message =
      error instanceof Error ? error.message : 'Erro desconhecido'

    return (
      <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-destructive/50 bg-destructive/5 p-8">
        <AlertCircle className="h-8 w-8 text-destructive" />
        <p className="text-sm font-medium text-destructive">{message}</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Planos de Estudo
          </h2>
          <p className="text-muted-foreground">
            Organize seus estudos com metas semanais por disciplina.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          size="icon"
          className="sm:size-auto sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Novo plano</span>
        </Button>
      </div>

      {(totalItems > 0 || hasActiveFilters) && <StudyPlansFilters />}

      <StudyPlansTable
        studyPlans={studyPlans}
        onDelete={setDeleteItem}
        onEdit={setEditItem}
        onChangeStatus={(plan, targetStatus) =>
          setStatusItem({ plan, targetStatus })
        }
        onCreateNew={openCreateDialog}
        hasActiveFilters={hasActiveFilters}
      />

      {totalPages > 1 && (
        <StudyPlansPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      )}

      <CreateStudyPlanDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      <EditStudyPlanDialog
        studyPlan={editItem}
        open={!!editItem}
        onOpenChange={(open) => !open && setEditItem(null)}
        onSuccess={handleEditSuccess}
      />

      <DeleteStudyPlanDialog
        studyPlan={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onSuccess={handleDeleteSuccess}
      />

      <ChangeStatusDialog
        studyPlan={statusItem?.plan ?? null}
        targetStatus={statusItem?.targetStatus ?? 'ARCHIVED'}
        open={!!statusItem}
        onOpenChange={(open) => !open && setStatusItem(null)}
        onSuccess={handleStatusSuccess}
      />
    </div>
  )
}
