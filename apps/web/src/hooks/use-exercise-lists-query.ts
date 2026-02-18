'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  fetchExerciseListsAction,
  type FetchExerciseListsParams,
} from '@/actions/exercise-list/fetch-exercise-lists'

export function useExerciseListsQuery(params: FetchExerciseListsParams = {}) {
  return useQuery({
    queryKey: ['exercise-lists', params],
    queryFn: () => fetchExerciseListsAction(params),
    placeholderData: keepPreviousData,
  })
}
