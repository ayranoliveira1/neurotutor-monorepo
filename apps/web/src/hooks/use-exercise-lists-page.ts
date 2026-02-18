'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useExerciseListsQuery } from '@/hooks/use-exercise-lists-query'
import type { ExerciseListItem } from '@/actions/exercise-list/types'

export function useExerciseListsPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const page = Number(searchParams.get('page')) || 1

  const query = useExerciseListsQuery({ page, perPage: 9 })

  const [createOpen, setCreateOpen] = useState(false)
  const [deleteItem, setDeleteItem] = useState<ExerciseListItem | null>(null)

  const invalidateLists = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['exercise-lists'] })
  }, [queryClient])

  const handleCreateSuccess = useCallback(() => {
    toast.success('Lista de exercícios criada com sucesso')
    invalidateLists()
    setCreateOpen(false)
  }, [invalidateLists])

  const handleDeleteSuccess = useCallback(() => {
    toast.success('Lista de exercícios excluída com sucesso')
    invalidateLists()
    setDeleteItem(null)
  }, [invalidateLists])

  const openCreateDialog = useCallback(() => {
    setCreateOpen(true)
  }, [])

  const closeDeleteDialog = useCallback(() => {
    setDeleteItem(null)
  }, [])

  return {
    ...query,
    exerciseLists: query.data?.exerciseLists ?? [],
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    totalItems: query.data?.totalItems ?? 0,
    createOpen,
    setCreateOpen,
    deleteItem,
    setDeleteItem,
    handleCreateSuccess,
    handleDeleteSuccess,
    openCreateDialog,
    closeDeleteDialog,
  }
}
