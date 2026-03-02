'use client'

import { useState, useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { useStudyPlansQuery } from '@/hooks/use-study-plans-query'
import type { StudyPlanItem } from '@/actions/study-plan/types'

export function useStudyPlansPage() {
  const searchParams = useSearchParams()
  const queryClient = useQueryClient()

  const page = Number(searchParams.get('page')) || 1
  const status = searchParams.get('status') ?? ''

  const query = useStudyPlansQuery({
    page,
    perPage: 9,
    ...(status && { status }),
  })

  const [createOpen, setCreateOpen] = useState(false)
  const [editItem, setEditItem] = useState<StudyPlanItem | null>(null)
  const [deleteItem, setDeleteItem] = useState<StudyPlanItem | null>(null)
  const [statusItem, setStatusItem] = useState<{
    plan: StudyPlanItem
    targetStatus: 'COMPLETED' | 'ARCHIVED'
  } | null>(null)

  const invalidatePlans = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['study-plans'] })
  }, [queryClient])

  const handleCreateSuccess = useCallback(() => {
    toast.success('Plano de estudo criado com sucesso')
    invalidatePlans()
    setCreateOpen(false)
  }, [invalidatePlans])

  const handleEditSuccess = useCallback(() => {
    toast.success('Plano de estudo atualizado com sucesso')
    invalidatePlans()
    setEditItem(null)
  }, [invalidatePlans])

  const handleDeleteSuccess = useCallback(() => {
    toast.success('Plano de estudo excluído com sucesso')
    invalidatePlans()
    setDeleteItem(null)
  }, [invalidatePlans])

  const handleStatusSuccess = useCallback(() => {
    toast.success('Status do plano atualizado com sucesso')
    invalidatePlans()
    setStatusItem(null)
  }, [invalidatePlans])

  const openCreateDialog = useCallback(() => {
    setCreateOpen(true)
  }, [])

  const hasActiveFilters = !!status

  return {
    ...query,
    studyPlans: query.data?.studyPlans ?? [],
    totalPages: query.data?.totalPages ?? 0,
    currentPage: query.data?.currentPage ?? 1,
    totalItems: query.data?.totalItems ?? 0,
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
  }
}
