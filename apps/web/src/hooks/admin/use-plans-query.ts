'use client'

import { useQuery } from '@tanstack/react-query'
import { listPlansAction } from '@/actions/admin/list-plans'

export function usePlansQuery() {
  return useQuery({
    queryKey: ['admin', 'plans'],
    queryFn: () => listPlansAction(),
    staleTime: 5 * 60 * 1000,
  })
}
