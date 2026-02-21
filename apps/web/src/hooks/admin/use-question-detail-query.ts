'use client'

import { useQuery } from '@tanstack/react-query'
import { getQuestionAction } from '@/actions/admin/questoes/get-question'

export function useQuestionDetailQuery(id: string) {
  return useQuery({
    queryKey: ['admin', 'questions', 'detail', id],
    queryFn: () => getQuestionAction(id),
  })
}
