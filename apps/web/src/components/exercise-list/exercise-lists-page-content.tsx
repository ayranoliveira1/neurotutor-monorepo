'use client'

import { Button } from '@/components/ui/button'
import { Plus, AlertCircle } from 'lucide-react'
import { useExerciseListsPage } from '@/hooks/use-exercise-lists-page'
import { ExerciseListsTable } from './exercise-lists-table'
import { ExerciseListsPagination } from './exercise-lists-pagination'
import { CreateExerciseListDialog } from './create-exercise-list-dialog'
import { DeleteExerciseListDialog } from './delete-exercise-list-dialog'
import { ExerciseListsPageSkeleton } from './exercise-lists-page-skeleton'
import { ExerciseListsFilters } from './exercise-lists-filters'

export function ExerciseListsPageContent() {
  const {
    isLoading,
    isError,
    error,
    exerciseLists,
    totalPages,
    currentPage,
    totalItems,
    hasActiveFilters,
    createOpen,
    setCreateOpen,
    deleteItem,
    setDeleteItem,
    handleCreateSuccess,
    handleDeleteSuccess,
    openCreateDialog,
  } = useExerciseListsPage()

  if (isLoading) {
    return <ExerciseListsPageSkeleton />
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
            Listas de Exercícios
          </h2>
          <p className="text-muted-foreground">
            Crie e gerencie suas listas de exercícios.
          </p>
        </div>
        <Button
          onClick={openCreateDialog}
          size="icon"
          className="sm:size-auto sm:px-4 sm:py-2"
        >
          <Plus className="h-4 w-4 sm:mr-2" />
          <span className="hidden sm:inline">Nova lista</span>
        </Button>
      </div>

      {(totalItems > 0 || hasActiveFilters) && <ExerciseListsFilters />}

      <ExerciseListsTable
        exerciseLists={exerciseLists}
        onDelete={setDeleteItem}
        onCreateNew={openCreateDialog}
        hasActiveFilters={hasActiveFilters}
      />

      {totalPages > 1 && (
        <ExerciseListsPagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
        />
      )}

      <CreateExerciseListDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSuccess={handleCreateSuccess}
      />

      <DeleteExerciseListDialog
        exerciseList={deleteItem}
        open={!!deleteItem}
        onOpenChange={(open) => !open && setDeleteItem(null)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  )
}
