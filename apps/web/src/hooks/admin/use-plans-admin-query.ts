'use client'

import { useQuery } from '@tanstack/react-query'
import { listPlansAdminAction } from '@/actions/admin/planos/list-plans-admin'

export function usePlansAdminQuery() {
  return useQuery({
    queryKey: ['admin', 'plans', 'manage'],
    queryFn: () => listPlansAdminAction(),
  })
}
