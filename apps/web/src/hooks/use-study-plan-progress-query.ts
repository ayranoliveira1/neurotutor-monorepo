'use client'

import { useQuery } from '@tanstack/react-query'
import { getStudyPlanProgressAction } from '@/actions/study-plan/get-study-plan-progress'

export function useStudyPlanProgressQuery(id: string) {
  return useQuery({
    queryKey: ['study-plan-progress', id],
    queryFn: () => getStudyPlanProgressAction(id),
    enabled: !!id,
  })
}
