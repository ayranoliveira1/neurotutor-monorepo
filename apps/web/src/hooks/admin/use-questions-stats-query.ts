'use client'

import { useQuery } from '@tanstack/react-query'
import { getQuestionsStatsAction } from '@/actions/admin/get-questions-stats'

export function useQuestionsStatsQuery() {
  return useQuery({
    queryKey: ['admin', 'questions', 'stats'],
    queryFn: () => getQuestionsStatsAction(),
    staleTime: 15 * 1000,
  })
}
