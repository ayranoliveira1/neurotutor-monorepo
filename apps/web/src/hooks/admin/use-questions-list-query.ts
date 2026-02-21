'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  listQuestionsAction,
  type ListQuestionsParams,
} from '@/actions/admin/questoes/list-questions'

export function useQuestionsListQuery(params: ListQuestionsParams) {
  return useQuery({
    queryKey: ['admin', 'questions', 'list', params],
    queryFn: () => listQuestionsAction(params),
    placeholderData: keepPreviousData,
  })
}
