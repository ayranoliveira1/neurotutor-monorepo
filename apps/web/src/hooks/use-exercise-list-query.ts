'use client'

import { useQuery } from '@tanstack/react-query'
import { getExerciseListAction } from '@/actions/exercise-list/get-exercise-list'

export function useExerciseListQuery(id: string) {
  return useQuery({
    queryKey: ['exercise-list', id],
    queryFn: () => getExerciseListAction(id),
    enabled: !!id,
    refetchOnMount: 'always',
  })
}
