'use client'

import { useQuery, keepPreviousData } from '@tanstack/react-query'
import {
  listUsersAction,
  type ListUsersParams,
} from '@/actions/admin/usuarios/list-users'

export function useUsersQuery(params: ListUsersParams) {
  return useQuery({
    queryKey: ['admin', 'users', params],
    queryFn: () => listUsersAction(params),
    placeholderData: keepPreviousData,
  })
}
