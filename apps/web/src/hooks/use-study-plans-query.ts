'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  fetchStudyPlansAction,
  type FetchStudyPlansParams,
} from '@/actions/study-plan/fetch-study-plans'

export function useStudyPlansQuery(params: FetchStudyPlansParams = {}) {
  return useQuery({
    queryKey: ['study-plans', params],
    queryFn: () => fetchStudyPlansAction(params),
    placeholderData: keepPreviousData,
  })
}
