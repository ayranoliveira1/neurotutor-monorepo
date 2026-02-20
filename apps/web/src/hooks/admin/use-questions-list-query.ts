'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  listQuestionsAction,
  type ListQuestionsParams,
} from '@/actions/admin/list-questions'

export function useQuestionsListQuery(params: ListQuestionsParams) {
  return useQuery({
    queryKey: ['admin', 'questions', 'list', params],
    queryFn: () => listQuestionsAction(params),
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
  })
}
