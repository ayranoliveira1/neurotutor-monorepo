'use client'

import { useQuery } from '@tanstack/react-query'
import { getExerciseListResultAction } from '@/actions/exercise-list/get-exercise-list-result'

export function useExerciseListResultQuery(id: string) {
  return useQuery({
    queryKey: ['exercise-list-result', id],
    queryFn: () => getExerciseListResultAction(id),
    enabled: !!id,
  })
}
