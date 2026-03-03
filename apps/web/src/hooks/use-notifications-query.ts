'use client'

import { useQuery } from '@tanstack/react-query'
import { fetchNotificationsAction } from '@/actions/notifications/fetch-notifications'

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ['notifications'],
    queryFn: () => fetchNotificationsAction(),
    staleTime: 30 * 1000,
  })
}
